import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { View, TouchableOpacity, Image, Modal, Linking, ScrollView, FlatList, Alert, Dimensions, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import axios from "axios";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { launchImageLibrary } from "react-native-image-picker";
import { Camera, useCameraDevice } from 'react-native-vision-camera';
// @react-navigation
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
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
    'banana': 'Organic',
    'can': 'Recyclable',
    'bottle': 'Recyclable',
    'styrofoam': 'Non-recyclable',
    'diaper': 'Hazardous',
    // Add more mappings based on detected objects
};

// ----------------------------------------------------------------------

export default function ScanScreen() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(null);
    const [detectedObjects, setDetectedObjects] = useState([]);
    const [categoryDesc, setCategoryDesc] = useState({});
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

    const getCategoryByObjectName = async (objectName) => {
        try {
            const objectQuery = query(collection(firestore, 'objects'), where('objName', '==', objectName));
            const objectSnapshot = await getDocs(objectQuery);

            if (objectSnapshot.empty) return null;

            const objectDoc = objectSnapshot.docs[0].data();
            const categoryIds = objectDoc.categoryId;
            const categoryDescs = objectDoc.categoryDesc;

            const finalCategoryDesc = categoryDescs || categoryDesc || ['No description'];

            const categoryQuery = query(collection(firestore, 'categories'), where('categoryId', 'in', categoryIds));
            const categorySnapshot = await getDocs(categoryQuery);

            if (categorySnapshot.empty) return null;

            const categories = categorySnapshot.docs.map(doc => doc.data());

            return { categories, categoryDesc: finalCategoryDesc };
        } catch (error) {
            console.error("Error fetching categories:", error);
            return null;
        }
    };

    const analyzeImage = async (base64Image, photoURL) => {
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

            const cleanedObjects = await Promise.all(
                objectAnnotations.map(async (obj) => {
                    const { categories, categoryDesc } = await getCategoryByObjectName(obj.name, categoryDesc);
                    const categoryDescriptions = categoryDesc.length > 0 ? categoryDesc : ['No description'];

                    return {
                        name: obj.name,
                        score: obj.score,
                        vertices: obj.boundingPoly.normalizedVertices,
                        categories: categories?.map(c => c.categoryName) || ['Unknown'],
                        categoryDesc: categoryDescriptions,
                        recycleInstruction: categories?.map(c => c.categoryRecycle) || ['N/A'],
                        isRecyclable: categories?.[0]?.isRecyclable ?? false,
                        photoURL: photoURL,
                    };
                })
            );

            setDetectedObjects(cleanedObjects);
            setIsDrawerVisible(true);

            await addWasteToFirestore(cleanedObjects, photoURL);
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

    const addWasteToFirestore = async (detectedObjects, photoURL) => {
        const blob = await validateImage(photoURL);
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
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to save waste data.',
                text2: error.message,
            });
            console.error("Error saving waste data:", error);
        }
    };

    const uniqueDetectedObjects = Array.from(
        new Map(detectedObjects.map(obj => [obj.name, obj])).values()
    );

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
                padding: imageUri ? 20 : 0,
            }}
        >
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 10, zIndex: 9 }}>
                <HeaderTriple title="Scan" style={{ fontWeight: 700 }} />
            </View>

            {imageUri && (
                <View>
                    <View style={{ position: "relative", width: "100%" }}
                        onLayout={(event) => {
                            const layoutWidth = event.nativeEvent.layout.width;
                            setImageLayout({
                                width: layoutWidth,
                                height: layoutWidth / aspectRatio,
                            });
                        }}>
                        <Image source={{ uri: imageUri }} style={{ aspectRatio, width }} />

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
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                    <View
                        style={{
                            backgroundColor: 'white',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            maxHeight: '70%',
                        }}
                    >

                        {uniqueDetectedObjects.map((obj, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Image
                                    source={obj.photoURL ? { uri: obj.photoURL } : require("../../assets/sortify-logo.png")}
                                    style={{
                                        width: '25%',
                                        aspectRatio: 1,
                                        resizeMode: 'cover',
                                        borderTopLeftRadius: 20,
                                        borderBottomLeftRadius: 20,
                                    }}
                                />

                                <View style={{ flexDirection: 'column', justifyContent: 'center', width: '70%', }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View>
                                            {obj.categories.map((category, index) => (
                                                <View key={index}>
                                                    <Text style={{ fontSize: 16, fontWeight: '700' }}>
                                                        {category}
                                                    </Text>
                                                    {/* Check if there is a corresponding description */}
                                                    <Text style={{ fontSize: 14, fontWeight: '400' }}>
                                                        {obj.categoryDesc[index] || 'No description available'}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>

                                        <TouchableOpacity onPress={() => { navigation.navigate('Feedback') }}>
                                            <Iconify icon="material-symbols:flag" color="#000" size={25} style={{}} />
                                        </TouchableOpacity>
                                    </View>

                                    <Text>{obj.name}</Text>

                                    <View
                                        style={{
                                            backgroundColor: '#e5e5e5',
                                            paddingVertical: 3,
                                            paddingHorizontal: 5,
                                            borderRadius: 20,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 58,
                                            marginTop: 5,
                                        }}
                                    >
                                        <Iconify icon="twemoji:coin" color={palette.primary.main} size={12} />
                                        <Text style={{ fontWeight: 700, fontSize: 11, marginLeft: 6 }}>{obj.point}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}

                        <Button
                            mode="contained"
                            onPress={resetScanScreen}
                            style={{ backgroundColor: '#000', width: '100%', marginTop: 20 }}
                            labelStyle={{ color: '#fff' }}
                        >
                            Sorted!
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}