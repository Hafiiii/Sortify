import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { View, TouchableOpacity, Image, Modal, Linking, ScrollView, Alert, Dimensions, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import axios from "axios";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { launchImageLibrary } from "react-native-image-picker";
import { Camera, useCameraDevice } from 'react-native-vision-camera';
// @react-navigation
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
// firebase
import { firestore, storage } from '../utils/firebase';
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// auth
import { useAuth } from '../context/AuthContext';
// components
import { GOOGLE_VISION_API_KEY } from '@env';
import { HeaderTriple } from "../components/Header/Header";
import palette from "../theme/palette";
import { Iconify } from 'react-native-iconify';
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const WASTE_TYPE_MAP = {
    'Plastic': 'Non-recyclable',
    'Paper': 'Recyclable',
    'Glass': 'Recyclable',
    'Metal': 'Recyclable',
    'Food': 'Organic',
    'Organic': 'Organic',
    // Add more mappings based on detected objects
};

// ----------------------------------------------------------------------

export default function ScanScreen() {
    const { user } = useAuth();
    const [imageUri, setImageUri] = useState(null);
    const [detectedObjects, setDetectedObjects] = useState([]);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(null);
    const device = useCameraDevice('back');
    const camera = useRef(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const isFocused = useIsFocused();

    const checkCameraPermission = async () => {
        const status = Camera.getCameraPermissionStatus();

        if (status === 'granted') {
            setCameraPermission(true);
        } else if (status === 'notDetermined') {
            const permission = await Camera.requestCameraPermission();
            setCameraPermission(permission === 'authorized');
        } else {
            setCameraPermission(false);
        }
    };

    useEffect(() => {
        checkCameraPermission();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setIsCameraActive(true);
            return () => setIsCameraActive(false);
        }, [])
    );

    const takePhoto = async () => {
        try {
            if (!camera.current) {
                console.error('Camera reference not available.', camera.current);
                return;
            }

            const photo = await camera.current.takePhoto();
            console.log(photo);

            if (photo) {
                setCapturedPhoto(`file://${photo.path}`);
                setShowPreview(true);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Photo captured is undefined or empty.',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error capturing photo.',
            });
        }
    };

    const confirmPhoto = async () => {
        try {
            if (!capturedPhoto) return;

            setCapturedPhoto(null);
            await analyzeImage(base64, capturedPhoto);
            setShowPreview(false);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to analyze or upload the image.',
            });
        }
    };

    const retakePhoto = () => {
        setCapturedPhoto(null);
        setShowPreview(false);
    };

    const selectImage = async () => {
        launchImageLibrary(
            { mediaType: "photo", quality: 1, includeBase64: true },
            async (response) => {
                if (response.didCancel) return;
                if (response.assets && response.assets.length > 0) {
                    const image = response.assets[0];
                    setImageUri(image.uri);
                    await analyzeImage(image.base64, image.uri);
                }
            }
        );
    };

    const analyzeImage = async (base64Image, imageURL) => {
        try {
            const response = await axios.post(
                `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
                {
                    requests: [
                        {
                            image: { content: base64Image },
                            features: [
                                { type: "OBJECT_LOCALIZATION", maxResults: 10 },
                                { type: "LABEL_DETECTION", maxResults: 10 },
                            ]
                        }
                    ]
                }
            );

            const objectAnnotations = response.data.responses[0].localizedObjectAnnotations || [];
            const cleanedObjects = objectAnnotations
                .filter(obj => obj.boundingPoly && obj.boundingPoly.normalizedVertices)
                .map(obj => ({
                    name: obj.name,
                    score: obj.score,
                    vertices: obj.boundingPoly.normalizedVertices,
                    wasteType: WASTE_TYPE_MAP[obj.name] || 'Unknown',
                }));

            setDetectedObjects(cleanedObjects);
            setIsDrawerVisible(true);

            await addWasteToFirestore(cleanedObjects, imageURL);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'There was a problem analyzing the image.',
            });
        }
    };

    const validateImage = (uri) => {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileSize = blob.size;
            const fileType = blob.type;

            if (fileSize > MAX_IMAGE_SIZE) {
                reject("Image size exceeds the 5MB limit.");
            } else if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
                reject("Invalid image type. Only JPEG and PNG are allowed.");
            } else {
                resolve(blob);
            }
        });
    };

    const addWasteToFirestore = async (detectedObjects, imageURL) => {
        const blob = await validateImage(imageURL);
        const storageRef = ref(storage, `wastes_images/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        try {
            if (!user?.uid) {
                Alert.alert("Error", "User not authenticated.");
                return;
            }

            for (const obj of detectedObjects) {
                const q = query(
                    collection(firestore, 'wastes'),
                    where('wasteName', '==', obj.name),
                    where('wasteType', '==', obj.wasteType),
                    where('uid', '==', user.uid)
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    continue;
                }

                const wasteDocRef = doc(collection(firestore, 'wastes'));

                const wasteData = {
                    wasteId: wasteDocRef.id,
                    wasteName: obj.name,
                    wasteType: obj.wasteType,
                    score: obj.score,
                    dateAdded: new Date(),
                    uid: user?.uid,
                    photoURL: downloadURL || "",
                };

                await setDoc(wasteDocRef, wasteData);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to save waste data.',
            });
        }
    };

    const uniqueDetectedObjects = Array.from(
        new Map(detectedObjects.map(obj => [obj.name, obj])).values()
    );

    if (cameraPermission === null) {
        return <Text>Checking camera permission...</Text>;
    } else if (!cameraPermission) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginBottom: 10 }}>Camera permission not granted</Text>
                <Button
                    title="Open Settings"
                    onPress={() => Linking.openSettings()}
                />
            </View>
        );
    }

    if (!device) {
        return <Text>No camera device available</Text>;
    }

    return (
        <View
            style={{
                flex: 1,
                width: width,
                height: height,
                padding: 20,
            }}
        >
            <HeaderTriple title="Scan" style={{ fontWeight: 700 }} boxStyle={{ marginBottom: 20 }} />

            {imageUri && (
                <View>
                    <View style={{ position: "relative" }}>
                        <Image source={{ uri: imageUri }} style={{ width: 300, height: 300 }} />
                        <Svg width={300} height={300} style={{ position: "absolute", top: 0, left: 0 }}>
                            {detectedObjects.map((obj, index) => {
                                if (!obj.vertices || obj.vertices.length < 4) return null;
                                const [v1, v2, v3] = obj.vertices;

                                const boxX = v1.x * 300;
                                const boxY = v1.y * 300;
                                const boxWidth = (v3.x - v1.x) * 300;
                                const boxHeight = (v3.y - v1.y) * 300;

                                return (
                                    <Fragment key={index}>
                                        <Rect
                                            x={boxX}
                                            y={boxY}
                                            width={boxWidth}
                                            height={boxHeight}
                                            stroke="red"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                        <SvgText
                                            x={boxX}
                                            y={boxY - 5}
                                            fontSize="14"
                                            fill="red"
                                        >
                                            {obj.name} ({(obj.score * 100).toFixed(1)}%)
                                        </SvgText>
                                    </Fragment>
                                );
                            })}
                        </Svg>
                    </View>
                </View>
            )}

            <View style={{ flex: 1 }}>
                {isFocused && (
                    <View style={{ flex: 1 }}>
                        <Camera
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={true}
                            ref={camera}
                            photo={true}
                            video={true}
                            photoQualityBalance="quality"
                        />
                    </View>
                )}
                {showPreview && capturedPhoto ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={{ uri: capturedPhoto }}
                            style={{ width: 300, height: 300, marginBottom: 20 }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button title="Retake" onPress={retakePhoto} />
                            <Button title="Confirm" onPress={confirmPhoto} />
                        </View>
                    </View>
                ) : (
                    <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' }}>
                        <TouchableOpacity onPress={takePhoto}>
                            <View style={{
                                borderRadius: 50,
                                width: 60,
                                height: 60,
                                backgroundColor: '#000',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <View style={{
                                    borderRadius: 50,
                                    width: 48,
                                    height: 48,
                                    backgroundColor: '#fff',
                                }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <TouchableOpacity
                onPress={selectImage}
                style={{ backgroundColor: '#fff', borderRadius: 50, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 40, right: 40 }}
            >
                <Iconify icon="solar:gallery-bold" color="#000" size={24} />
            </TouchableOpacity>

            <Modal
                visible={isDrawerVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsDrawerVisible(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 20,
                        maxHeight: '60%',
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 10,
                        }}>Detected Objects</Text>
                        <ScrollView>
                            {uniqueDetectedObjects.map((obj, index) => (
                                <Text key={index} style={{ fontSize: 16, marginTop: 5 }}>
                                    • {obj.name} - Waste Type: {obj.wasteType}
                                </Text>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setIsDrawerVisible(false)}>
                            <Text style={{ color: palette.primary, marginTop: 10 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}