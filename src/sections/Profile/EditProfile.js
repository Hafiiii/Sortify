import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Dimensions, Image, Alert, ImageBackground, Keyboard } from 'react-native';
import { Button, Text, TextInput, ActivityIndicator } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// firebase
import { firestore, storage } from '../../utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// auth
import { useAuth } from '../../context/AuthContext';
// datepicker
import dayjs from "dayjs";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
// components
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import palette from '../../theme/palette';
import { Iconify } from 'react-native-iconify';
import { ReturnButton } from '../../components/GoBackButton/GoBackButton';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('screen');

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const phoneRegExp = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required').max(50, 'First Name cannot exceed 50 characters'),
    lastName: Yup.string().required('Last Name is required').max(50, 'Last Name cannot exceed 50 characters'),
    phoneNumber: Yup.string().required('Phone number is required').matches(phoneRegExp, 'Phone number must be a valid number (01XXXXXXXX)'),
});

// ----------------------------------------------------------------------

export default function EditProfile() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [photoURL, setPhotoURL] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(ProfileSchema),
    });

    useEffect(() => {
        if (user?.uid) {
            const fetchUserProfile = async () => {
                try {
                    const userDoc = await getDoc(doc(firestore, "users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setValue('firstName', userData.firstName || '');
                        setValue('lastName', userData.lastName || '');
                        setValue('gender', userData.gender || '');
                        setValue('email', userData.email || '');
                        setValue('phoneNumber', userData.phoneNumber || '');
                        setValue('birthday', userData.birthday || '');
                        setPhotoURL(userData.photoURL);
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error fetching user data.',
                    });
                }
            };
            fetchUserProfile();
        }
    }, [user, setValue]);


    const pickImage = async () => {
        Alert.alert(
            "Choose an option",
            "Select an image from gallery or take a new photo",
            [
                {
                    text: "Camera",
                    onPress: async () => {
                        const result = await launchCamera({ mediaType: 'photo', cameraType: 'back' });
                        if (!result.didCancel && result.assets?.length > 0) {
                            const selectedUri = result.assets[0].uri;
                            await uploadImage(selectedUri);
                        }
                    }
                },
                {
                    text: "Gallery",
                    onPress: async () => {
                        const result = await launchImageLibrary({ mediaType: 'photo' });
                        if (!result.didCancel && result.assets?.length > 0) {
                            const selectedUri = result.assets[0].uri;
                            await uploadImage(selectedUri);
                        }
                    }
                },
                { text: "Cancel", style: "cancel" }
            ]
        );
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

    const uploadImage = async (uri) => {
        try {
            console.log('uri:', uri);
            setUploading(true);

            const blob = await validateImage(uri);

            const storageRef = ref(storage, `profile_images/${Date.now()}.jpg`);
            await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(storageRef);
            console.log('Uploaded Image URL:', downloadURL);

            if (user?.uid) {
                await updateDoc(doc(firestore, "users", user.uid), {
                    photoURL: downloadURL,
                });
            }

            setPhotoURL(downloadURL);
            setUploading(false);

            Toast.show({
                type: 'success',
                text1: 'Profile photo updated successfully!',
            });
        } catch (error) {
            setUploading(false);

            Toast.show({
                type: 'error',
                text1: 'Failed to upload image',
            });
            console.error("Error uploading image:", error);
        }
    };

    const handleUpdateProfile = async (data) => {
        if (!user?.uid) return;

        setLoading(true);
        try {
            await updateDoc(doc(firestore, "users", user.uid), {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                gender: data.gender,
                phoneNumber: data.phoneNumber,
                birthday: data.birthday,
                photoURL: photoURL,
            });

            Toast.show({
                type: 'success',
                text1: 'Profile Updated Successfully',
            });

            navigation.navigate("Main", { screen: "ProfileStack", params: { screen: "Profile" } });
        } catch (err) {

            Toast.show({
                type: 'error',
                text1: 'Failed to update profile',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../../../assets/sortify-logo.png')}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            resizeMode="cover"
            imageStyle={{ opacity: 0.4 }}
        >
            <View
                style={{
                    flex: 1,
                    width: width,
                    height: height,
                    padding: 40,
                }}
            >
                <ReturnButton />

                <Text style={{ fontSize: 22, fontWeight: 700 }}>Edit Profile Details</Text>

                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={photoURL ? { uri: photoURL } : require('../../../assets/profile.jpeg')}
                            style={{ width: 100, height: 100, borderRadius: 65 }}
                        />
                        {uploading && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    borderRadius: 65
                                }}
                            >
                                <ActivityIndicator size="large" color={palette.info.main} />
                            </View>
                        )}
                        {!uploading && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    borderRadius: 65
                                }}
                            >
                                <Iconify icon={'fe:edit'} size={36} color="#f0f0f0" />
                            </View>)}
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 23,
                        borderWidth: 1,
                        borderColor: '#000',
                        padding: 25,
                    }}
                >
                    <Controller
                        control={control}
                        name="firstName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={{ marginBottom: 15 }}>
                                <TextInput
                                    placeholder="First Name"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={!!errors.firstName}
                                    underlineStyle={{ backgroundColor: 'transparent' }}
                                    style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 45 }}
                                />
                                {errors.firstName && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors.firstName.message}</Text>}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="lastName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={{ marginBottom: 15 }}>
                                <TextInput
                                    placeholder="Last Name"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={!!errors.lastName}
                                    underlineStyle={{ backgroundColor: 'transparent' }}
                                    style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 45 }}
                                />
                                {errors.lastName && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors.lastName.message}</Text>}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="gender"
                        render={({ field: { onChange, value } }) => (
                            <View style={{ marginBottom: 15, borderWidth: 1, borderColor: "#000", borderRadius: 8, height: 45 }}>
                                <Picker selectedValue={value} onValueChange={onChange} style={{ marginTop: -4, marginLeft: 6 }}>
                                    <Picker.Item label="Select Gender" value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                    <Picker.Item label="Other" value="other" />
                                </Picker>
                                {errors.gender && <Text style={{ color: "red", fontSize: 10 }}>{errors.gender.message}</Text>}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={{ marginBottom: 15 }}>
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    disabled={true}
                                    error={!!errors.phoneNumber}
                                    underlineStyle={{ backgroundColor: 'transparent' }}
                                    style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 45 }}
                                />
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="phoneNumber"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={{ marginBottom: 15 }}>
                                <TextInput
                                    placeholder="Phone Number"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="phone-pad"
                                    error={!!errors.phoneNumber}
                                    underlineStyle={{ backgroundColor: 'transparent' }}
                                    style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 45 }}
                                />
                                {errors.phoneNumber && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors.phoneNumber.message}</Text>}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="birthday"
                        render={({ field: { onChange, value } }) => (
                            <View style={{ marginBottom: 15 }}>
                                <View style={{ position: 'relative' }}>
                                    <TouchableOpacity onPress={() => {
                                        Keyboard.dismiss();
                                        setShowDatePicker(true);
                                    }}
                                    >
                                        <TextInput
                                            placeholder="Date of Birth"
                                            value={value ? dayjs(value).format("DD-MM-YYYY") : ""}
                                            editable={false}
                                            underlineStyle={{ backgroundColor: 'transparent' }}
                                            style={{ backgroundColor: "transparent", borderWidth: 1, borderColor: "#000", borderRadius: 8, height: 45, paddingRight: 40 }}
                                        />
                                        <Iconify
                                            icon={'mdi:calendar-outline'}
                                            size={20}
                                            style={{ position: "absolute", top: "50%", right: 10, transform: [{ translateY: -8 }] }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {showDatePicker && (
                                    <DateTimePicker
                                        mode="date"
                                        value={value ? new Date(value) : new Date()}
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) {
                                                onChange(dayjs(selectedDate).format("YYYY-MM-DD"));
                                            }
                                        }}
                                    />
                                )}
                                {errors.birthday && <Text style={{ color: "red", fontSize: 10 }}>{errors.birthday.message}</Text>}
                            </View>
                        )}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSubmit(handleUpdateProfile)}
                        loading={loading}
                        disabled={loading}
                        style={{ backgroundColor: '#000' }}
                        labelStyle={{ color: '#fff' }}
                    >
                        Save
                    </Button>
                </View>
            </View>
        </ImageBackground>
    );
}
