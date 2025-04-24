import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image, Button, Linking, ScrollView, Alert, Dimensions, Platform, PermissionsAndroid, StyleSheet } from "react-native";
import { useAppState } from '@react-native-community/hooks';
import axios from "axios";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { GOOGLE_VISION_API_KEY } from '@env';
import { Header } from "../components/Header/Header";
import palette from "../theme/palette";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { Camera, useCameraDevice, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
import RNFS, { readFile } from 'react-native-fs';
import { firestore, storage } from '../utils/firebase';
import { Iconify } from 'react-native-iconify';




// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

const WasteScanner = () => {
    const [imageUri, setImageUri] = useState(null);
    const [detectedObjects, setDetectedObjects] = useState([]);

    const [cameraPermission, setCameraPermission] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(null);
    const device = useCameraDevice('back'); // Set the initial camera device
    const camera = useRef(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [showPreview, setShowPreview] = useState(false);


    const isFocused = useIsFocused();
    const appState = useAppState();
    const isActive = isFocused && appState === "active";

    const checkCameraPermission = async () => {
        const status = await Camera.getCameraPermissionStatus();
        console.log('status', status);

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

    // const camera = useRef<Camera>(null);
    // const camera = useRef(null);

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
                console.error('Photo captured is undefined or empty.');
            }
        } catch (error) {
            console.error('Error capturing photo:', error);
        }
    };

    const confirmPhoto = async () => {
        try {
            if (!capturedPhoto) return;

            console.log('Photo confirmed:', capturedPhoto);

            // 1. Upload to Firebase Storage
            const filename = `waste-photos/${Date.now()}.jpg`;
            const reference = storage().ref(filename);
            await reference.putFile(capturedPhoto);
            const downloadURL = await reference.getDownloadURL();
            console.log('Uploaded to Firebase:', downloadURL);

            // 2. Read file and convert to base64
            const base64 = await readFile(capturedPhoto.replace("file://", ""), 'base64');
            await analyzeImage(base64); // Send to Google Vision

            // 3. Reset state
            setCapturedPhoto(null);
            setShowPreview(false);
        } catch (error) {
            console.error('Error confirming photo:', error);
            Alert.alert("Error", "Failed to analyze or upload the image.");
        }
    };

    const retakePhoto = () => {
        // User wants to retake the photo
        setCapturedPhoto(null); // Clear the captured photo
        setShowPreview(false); // Hide the preview
    };

    const onCameraReady = (ref) => {
        // Camera component is ready, set the camera reference
        camera.current = ref;// Reference to the Camera component (e.g., obtained from ref prop)
    };

    const selectImage = async () => {
        launchImageLibrary(
            { mediaType: "photo", quality: 1, includeBase64: true },
            async (response) => {
                if (response.didCancel) return;
                if (response.assets && response.assets.length > 0) {
                    const image = response.assets[0];
                    setImageUri(image.uri);
                    await analyzeImage(image.base64);
                }
            }
        );
    };

    const analyzeImage = async (base64Image) => {
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
                }));

            setDetectedObjects(cleanedObjects);
        } catch (error) {
            console.error("Error analyzing image:", error);
            Alert.alert("Error", "There was a problem analyzing the image.");
        }
    };

    return (
        <View
            style={{
                flex: 1,
                width: width,
                height: height,
            }}
        >
            <Header title="Scan" style={{ fontWeight: 700 }} />

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

                    {/* Display identified objects */}
                    <Text style={{ marginTop: 15, fontSize: 18, fontWeight: "bold" }}>Detected Objects:</Text>
                    {detectedObjects.map((obj, index) => (
                        <Text key={index} style={{ fontSize: 16, marginTop: 5 }}>
                            • {obj.name} ({(obj.score * 100).toFixed(1)}%)
                        </Text>
                    ))}
                </View>
            )}

            <View style={{ flex: 1 }}>
                {isFocused && (
                    <Camera
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={true}
                        ref={camera}
                        photo={true}
                        video={true}
                        photoQualityBalance="quality"
                    />
                )}
                {showPreview && capturedPhoto ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={{ uri: capturedPhoto }} // Assuming the photo is a valid URI
                            style={{ width: 300, height: 300, marginBottom: 20 }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button title="Retake" onPress={retakePhoto} />
                            <Button title="Confirm" onPress={confirmPhoto} />
                        </View>
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Button title="Take Photo" onPress={takePhoto} />
                    </View>

                )}

            </View>

            {/* <View style={{
                position: "absolute",
                bottom: 30,
                alignSelf: "center",
            }}>
                <TouchableOpacity onPress={() => takePhoto()} style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Text style={{ fontSize: 24 }}>📸</Text>
                </TouchableOpacity>
            </View> */}

            <TouchableOpacity
                onPress={selectImage}
                style={{ backgroundColor: '#e5e5e5', borderRadius: 50, width: 50, height: 50, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 20, right: 20 }}
            >
                <Iconify icon="solar:gallery-bold" color="#000" size={24} />
            </TouchableOpacity>
        </View>
    );
};

export default WasteScanner;