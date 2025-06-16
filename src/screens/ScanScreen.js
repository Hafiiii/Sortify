import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { View, TouchableOpacity, Image, Modal, Linking, ScrollView, Alert, Dimensions, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import axios from "axios";
// image
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { launchImageLibrary } from "react-native-image-picker";
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import ImageResizer from '@bam.tech/react-native-image-resizer';
// @react-navigation
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
// firebase
import { firestore, storage } from '../utils/firebase';
import { collection, doc, setDoc, query, where, getDocs, increment, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// auth
import { useAuth } from '../context/AuthContext';
// components
import { GOOGLE_VISION_API_KEY } from '@env';
import { HeaderTriple } from "../components/Header/Header";
import palette from "../theme/palette";
import { Iconify } from 'react-native-iconify';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from '../utils/helper';
import LoadingIndicator from '../components/Animated/LoadingIndicator';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

export default function ScanScreen() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analyzeLoading, setAnalyzeLoading] = useState(false);
    const [detectedObjects, setDetectedObjects] = useState([]);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(null);
    const device = useCameraDevice('back');
    const camera = useRef(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const isFocused = useIsFocused();
    const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
    const aspectRatio = 1;

    const checkCameraPermission = async () => {
        const status = Camera.getCameraPermissionStatus();
        if (status === 'granted') {
            setCameraPermission(true);
            return true;
        } else if (status === 'notDetermined') {
            const permission = await Camera.requestCameraPermission();
            setCameraPermission(permission === 'authorized');
            return permission === 'authorized';
        } else {
            setCameraPermission(false);
            return false;
        }
    };

    useEffect(() => {
        checkCameraPermission();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setIsCameraActive(true);
            setImageUri(null);
            setCapturedPhoto(null);
            setShowPreview(false);
            setDetectedObjects([]);
            setIsDrawerVisible(false);
            setAnalyzeLoading(false);

            return () => {
                setIsCameraActive(false);
            };
        }, [])
    );

    const takePhoto = async () => {
        try {
            if (!camera.current) {
                Toast.show({ type: 'error', text1: 'Camera reference not available.', text2: error.message || 'Please ensure the camera is functioning properly.' });
                return;
            }

            const photo = await camera.current.takePhoto();

            if (photo) {
                const uri = `file://${photo.path}`;
                try {
                    const resizedImage = await ImageResizer.createResizedImage(
                        uri,
                        800,
                        800,
                        'JPEG',
                        80
                    );

                    const base64 = await RNFS.readFile(resizedImage.uri, 'base64');
                    setImageUri(resizedImage.uri);
                    await analyzeImage(base64, resizedImage.uri);
                } catch (err) {
                    Toast.show({ type: 'error', text1: 'Image resizing failed.', text2: err.message });
                }
            } else {
                Toast.show({ type: 'error', text1: 'Photo captured is undefined or empty.', text2: error.message || 'Please try again.' });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error capturing photo.', text2: error.message || 'Please ensure the camera is functioning properly.' });
        }
    };

    const selectImage = async () => {
        launchImageLibrary(
            { mediaType: "photo", quality: 1, includeBase64: false },
            async (response) => {
                if (response.didCancel) return;
                if (response.assets && response.assets.length > 0) {
                    const image = response.assets[0];

                    try {
                        const resizedImage = await ImageResizer.createResizedImage(
                            image.uri,
                            800,
                            800,
                            'JPEG',
                            80
                        );

                        const resizedBase64 = await RNFS.readFile(resizedImage.uri, 'base64');
                        setImageUri(resizedImage.uri);
                        await analyzeImage(resizedBase64, resizedImage.uri);
                    } catch (err) {
                        Toast.show({ type: 'error', text1: 'Image resizing failed.', text2: err.message });
                    }
                }
            }
        );
    };

    const analyzeImage = async (base64Image, photoURL) => {
        setAnalyzeLoading(true);

        try {
            const response = await axios.post(
                `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
                {
                    requests: [
                        {
                            image: { content: base64Image },
                            features: [
                                { type: "OBJECT_LOCALIZATION", maxResults: 10 },
                                { type: "LABEL_DETECTION", maxResults: 10 }
                            ]
                        }
                    ]
                }
            );

            const objectAnnotations = response.data.responses[0].localizedObjectAnnotations || [];
            const labelAnnotations = response.data.responses[0].labelAnnotations || [];

            const objectMap = new Map();

            objectAnnotations.forEach(obj => {
                objectMap.set(obj.name.toLowerCase(), {
                    ...obj,
                    detectionType: 'object'
                });
            });

            labelAnnotations.forEach(label => {
                const key = label.description.toLowerCase();
                if (!objectMap.has(key)) {
                    objectMap.set(key, {
                        name: label.description,
                        score: label.score,
                        boundingPoly: { normalizedVertices: [] },
                        detectionType: 'label'
                    });
                }
            });

            const combinedRawObjects = Array.from(objectMap.values());

            const cleanedObjects = [];

            for (const obj of combinedRawObjects) {
                const { name, score, boundingPoly, type } = obj;

                const objectQuery = query(collection(firestore, 'objects'), where('objName', '==', name));
                const objectSnapshot = await getDocs(objectQuery);

                if (objectSnapshot.empty) continue;

                const objectDoc = objectSnapshot.docs[0].data();
                const categoryIds = objectDoc.categoryId;
                const categoryDescs = objectDoc.categoryDesc;

                const categoryQuery = query(collection(firestore, 'categories'), where('categoryId', 'in', categoryIds));
                const categorySnapshot = await getDocs(categoryQuery);

                const categories = categorySnapshot.empty ? [] : categorySnapshot.docs.map(doc => doc.data());
                const finalCategoryDesc = categoryDescs || ['No description'];

                cleanedObjects.push({
                    name,
                    score,
                    vertices: boundingPoly.normalizedVertices || [],
                    categories: categories.map(c => c.categoryName) || ['Unknown'],
                    categoryDesc: finalCategoryDesc,
                    recycleInstruction: categories.map(c => c.categoryRecycle) || ['N/A'],
                    isRecyclable: categories?.[0]?.isRecyclable ?? false,
                    photoURL,
                    detectionType: type,
                });
            }

            setDetectedObjects(cleanedObjects);
            setIsDrawerVisible(true);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'There was a problem analyzing the image.', text2: error.message || 'Please try again later.' });
        } finally {
            setAnalyzeLoading(false);
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

    const incrementUserTotalPoints = async (uid) => {
        if (!uid) return;

        const userDocRef = doc(firestore, 'users', uid);

        try {
            await updateDoc(userDocRef, {
                totalPoints: increment(1)
            });
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to update total points.', text2: error.message || 'Please try again.' });
        }
    };

    const addWasteToFirestore = async (detectedObjects, photoURL) => {
        const blob = await validateImage(photoURL);
        const storageRef = ref(storage, `wastes_images/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setLoading(true);

        try {
            if (!user?.uid) {
                Alert.alert("Error", "User not authenticated.");
                return;
            }

            for (const obj of detectedObjects) {
                const q = query(
                    collection(firestore, 'wastes'),
                    where('wasteName', '==', obj.name),
                    where('wasteType', '==', obj.categories),
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
                    wasteType: obj.categories,
                    score: obj.score,
                    dateAdded: new Date(),
                    uid: user?.uid,
                    photoURL: downloadURL || "",
                };

                await setDoc(wasteDocRef, wasteData);
                await incrementUserTotalPoints(user.uid);
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to save waste data.', text2: error.message || 'Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSorted = async () => {
        if (!user) {
            Alert.alert(
                'Login Required',
                'Please log in to save sorted items.',
                [
                    {
                        text: 'Cancel',
                        onPress: () => navigation.navigate('Scan'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]
            );
            return;
        }

        try {
            await addWasteToFirestore(detectedObjects, imageUri, user.uid);
            Toast.show({ type: 'success', text1: 'Sorted!', text2: 'Data saved successfully.' });
            resetScanScreen();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to save sorted data.', text2: error.message });
        }
    };

    const resetScanScreen = () => {
        setImageUri(null);
        setDetectedObjects([]);
        setCapturedPhoto(null);
        setShowPreview(false);
        setIsDrawerVisible(false);
    };

    if (cameraPermission === null) {
        return <Text>Checking camera permission...</Text>;
    } else if (!cameraPermission) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginBottom: 10 }}>Camera permission not granted</Text>
                <Button
                    mode="contained"
                    onPress={checkCameraPermission}
                    style={{ backgroundColor: '#000', marginBottom: 10 }}
                >
                    Try Again
                </Button>
                <Button
                    mode="contained"
                    onPress={() => Linking.openSettings()}
                    style={{ backgroundColor: '#000' }}
                >
                    Open Settings
                </Button>
            </View>
        );
    }

    if (!device) {
        return <Text>No camera device available</Text>;
    }

    if (analyzeLoading) return <LoadingIndicator />

    return (
        <View
            style={{
                flex: 1,
                width: width,
                height: height,
                padding: imageUri ? 10 : 0,
            }}
        >
            {!imageUri && (
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 10, zIndex: 9 }}>
                    <HeaderTriple title="Scan" style={{ fontWeight: 700 }} />
                </View>
            )}

            {imageUri && (
                <View>
                    <View style={{ position: "relative", width: "100%", alignItems: "center" }}
                        onLayout={(event) => {
                            const layoutWidth = event.nativeEvent.layout.width;
                            setImageLayout({ width: layoutWidth, height: layoutWidth });
                        }}>
                        <Image source={{ uri: imageUri }} style={{ aspectRatio, width: width * 0.9 }} />

                        {imageLayout.width > 0 && (
                            <Svg width={imageLayout.width}
                                height={imageLayout.height} style={{ position: "absolute", top: 0, left: 0, aspectRatio: 1 }}>

                                {detectedObjects.map((obj, index) => {
                                    if (!obj.vertices || obj.vertices.length < 4) return null;
                                    const [v1, v2, v3] = obj.vertices;

                                    const boxX = v1.x * imageLayout.width;
                                    const boxY = v1.y * imageLayout.height;
                                    const boxWidth = (v3.x - v1.x) * imageLayout.width;
                                    const boxHeight = (v3.y - v1.y) * imageLayout.height;

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
                                            <SvgText x={boxX} y={boxY - 5} fontSize="14" fill="red">
                                                {obj.name} ({(obj.score * 100).toFixed(1)}%)
                                            </SvgText>
                                        </Fragment>
                                    );
                                })}
                            </Svg>
                        )}
                    </View>
                </View>
            )}

            <View style={{ flex: 1 }}>
                {isFocused && !imageUri && (
                    <View style={{ flex: 1, position: 'relative' }}>
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
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 50,
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                }}
            >
                <Iconify icon="solar:gallery-bold" color="#000" size={24} />
            </TouchableOpacity>

            <Modal
                visible={isDrawerVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsDrawerVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            maxHeight: '40%',
                        }}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {detectedObjects && detectedObjects.length > 0 ? (
                                <>
                                    {detectedObjects.map((obj, index) => (
                                        <View key={index} >
                                            <Text style={{ fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', paddingVertical: 3, backgroundColor: palette.primary.light }}>{obj.name}</Text>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                                                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <View style={{ marginBottom: 15 }}>
                                                            {obj.categories.map((category, index) => (
                                                                <View key={index} style={{ marginBottom: 5 }}>
                                                                    <Text style={{ fontWeight: 700 }}>
                                                                        {category || 'Unknown'}
                                                                    </Text>

                                                                    <Text style={{ textAlign: 'justify', lineHeight: 18 }}>
                                                                        {obj.categoryDesc[index] || 'No description available'}
                                                                    </Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                    <Text style={{ fontSize: 12, color: palette.disabled.main, textAlign: 'center', marginVertical: 5 }}>Got wrong information? Click the flag icon below.</Text>
                                </>
                            ) : (
                                <View style={{ gap: 5, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        source={require('../../assets/sortify-search.webp')}
                                        style={{
                                            width: 75,
                                            height: 75,
                                            resizeMode: 'contain',
                                        }}
                                    />

                                    <Text style={{ fontSize: 16, color: palette.disabled.secondary }}>
                                        No item detected
                                    </Text>

                                    <Text style={{ textAlign: 'center', color: palette.disabled.main }}>
                                        We couldn’t recognize any recyclable items in your image. Make sure it’s clear, well-lit, and shows only one item at a time for better results. You can submit this issues to us by clicking the flag icon below.
                                    </Text>
                                </View>
                            )}
                        </ScrollView>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                            {detectedObjects && detectedObjects.length > 0 ? (
                                <Button
                                    mode="contained"
                                    onPress={handleSorted}
                                    loading={loading}
                                    disabled={loading}
                                    style={{ backgroundColor: '#000', width: '85%' }}
                                    labelStyle={{ color: '#fff' }}
                                >
                                    Sorted!
                                </Button>
                            ) : (
                                <Button
                                    mode="contained"
                                    onPress={resetScanScreen}
                                    style={{ backgroundColor: '#000', width: '85%' }}
                                    labelStyle={{ color: '#fff' }}
                                >
                                    Return to Scan
                                </Button>
                            )}

                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('ContactUs', {
                                        imageUri: imageUri,
                                        detectedObjects: detectedObjects
                                    });
                                }}
                                style={{ width: '10%', alignItems: 'center' }}
                            >
                                <Iconify icon="material-symbols:flag" size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
            </Modal >
        </View >
    );
}