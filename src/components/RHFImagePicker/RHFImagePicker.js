import { useState } from 'react';
import { View, Image, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
// form
import { Controller } from 'react-hook-form';
// firebase
import { storage } from '../../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// components
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

// ----------------------------------------------------------------------

export default function RHFImagePicker({ name, control, errors, imageName, storageFileName }) {
    const [uploading, setUploading] = useState(false);

    const pickImage = (onChange) => {
        Alert.alert(
            'Choose an option',
            'Select an image from gallery or take a new photo',
            [
                {
                    text: 'Camera',
                    onPress: async () => {
                        const result = await launchCamera({ mediaType: 'photo', cameraType: 'back' });
                        handleImageResult(result, onChange);
                    }
                },
                {
                    text: 'Gallery',
                    onPress: async () => {
                        const result = await launchImageLibrary({ mediaType: 'photo' });
                        handleImageResult(result, onChange);
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleImageResult = async (result, onChange) => {
        if (!result.didCancel && result.assets?.length > 0) {
            const uri = result.assets[0].uri;
            try {
                const downloadURL = await uploadImage(uri, imageName);
                onChange(downloadURL);
            } catch (error) {
                console.error(error);
                Toast.show({ type: 'error', text1: error.message || 'Image upload failed' });
            }
        }
    };


    const validateImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileSize = blob.size;
        const fileType = blob.type;

        if (fileSize > MAX_IMAGE_SIZE) throw new Error('Image size exceeds 5MB');
        if (!ALLOWED_IMAGE_TYPES.includes(fileType)) throw new Error('Invalid image type (JPEG/PNG only)');

        return blob;
    };

    const uploadImage = async (uri, imageName) => {
        setUploading(true);
        const blob = await validateImage(uri);

        const safeCategory = imageName.replace(/\s+/g, '-').toLowerCase();
        const filename = `${storageFileName}/${safeCategory}.jpg`;

        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        setUploading(false);
        Toast.show({ type: 'success', text1: 'Image uploaded successfully' });
        return downloadURL;
    };

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange } }) => (
                <View style={{ marginBottom: 15 }}>
                    {value ? (
                        <Image source={{ uri: value }} style={{ width: "100%", height: 140, resizeMode: 'cover', borderRadius: 8, marginBottom: 5 }} />
                    ) : null}

                    <Button
                        mode="contained"
                        onPress={() => pickImage(onChange)}
                        loading={uploading}
                        disabled={uploading}
                        style={{ backgroundColor: palette.primary.main, borderRadius: 8 }}
                        labelStyle={{ color: '#fff' }}
                    >
                        Pick Image
                    </Button>

                    {errors[name] &&
                        <Text style={{ color: palette.error.main, marginBottom: -9, fontSize: 10 }}>
                            {errors[name]?.message}
                        </Text>
                    }
                </View>
            )}
        />
    );
}
