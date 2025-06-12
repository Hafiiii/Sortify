import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @react-navigation
import { useRoute } from '@react-navigation/native';
// hooks
import { getUsers } from '../../hooks/getUsers';
// firebase
import { firestore, storage } from '../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// components
import Toast from 'react-native-toast-message';
import palette from '../../theme/palette';
import { launchImageLibrary } from 'react-native-image-picker';
import SupportSkeleton from './SupportSkeleton';

// ----------------------------------------------------------------------

const IssuesSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    issueMessage: Yup.string().required('Please describe your issue').min(10, 'Issue description must be at least 10 characters'),
});

// ----------------------------------------------------------------------

export default function ContactUsScreen() {
    const { userData } = getUsers();
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const { control, handleSubmit, setError: setFieldError, formState: { errors }, getValues, reset, setValue } = useForm({
        resolver: yupResolver(IssuesSchema),
        defaultValues: {
            name: '',
            email: '',
            issueMessage: '',
        },
    });

    useEffect(() => {
        if (userData) {
            if (userData.firstName) setValue('name', userData.firstName);
            if (userData.email) setValue('email', userData.email);
        }
        if (route.params?.detectedObjects && Array.isArray(route.params.detectedObjects)) {
            const messageFromDetectedObjects = route.params.detectedObjects.map((obj) => {
                const categoryLines = obj.categories.map((category, index) => {
                    const desc = obj.categoryDesc[index] || 'No description available';
                    return ` - ${category}: ${desc}`;
                }).join('\n');

                return `❌ ${obj.name}:\n${categoryLines}`;
            }).join('\n\n');

            setValue('issueMessage', messageFromDetectedObjects);
        }
        if (route.params?.imageUri) {
            setSelectedImage({ uri: route.params.imageUri });
        }
    }, [userData, setValue, route.params]);

    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Toast.show({ type: 'error', text1: 'Image Picker Error', text2: response.errorMessage });
                return;
            }

            if (response.assets && response.assets.length > 0) {
                setSelectedImage(response.assets[0]);
            }
        });
    };

    const uploadImageToFirebase = async (image) => {
        if (!image?.uri) return null;

        const response = await fetch(image.uri);
        const blob = await response.blob();

        const filename = `issue_images/${Date.now()}-${image.fileName || 'issueImage'}`;
        const imageRef = ref(storage, filename);

        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);

        return downloadURL;
    };

    const handleIssuesSubmit = async () => {
        setLoading(true);
        const { issueMessage, name, email } = getValues();

        const issuesId = new Date().getTime().toString();

        try {
            let imageUrl = null;
            if (selectedImage) {
                imageUrl = await uploadImageToFirebase(selectedImage);
            }

            const issuesData = {
                uid: userData?.uid,
                issuesId,
                issueMessage: issueMessage || '',
                name,
                email,
                imageUrl: imageUrl || '',
                dateAdded: new Date(),
            };

            const issuesDocRef = doc(firestore, 'issues', issuesId);
            await setDoc(issuesDocRef, issuesData);

            Toast.show({ type: 'success', text1: 'Your Concern is Submitted', text2: 'Thank you for reaching out to us. We will get back to you soon!' });

            reset();
            setSelectedImage(null);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Submission Failed', text2: error.message || 'Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SupportSkeleton
            title="Contact Us"
            description="Please let us know if you're facing any issues with the app. We are here to help!"
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={handleIssuesSubmit}
            loading={loading}
            includeImage
            selectedImage={selectedImage}
            pickImage={pickImage}
        >
            <Controller
                name="issueMessage"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <View style={{ marginBottom: 15 }}>
                        <TextInput
                            label="Describe your issue"
                            value={value}
                            onChangeText={onChange}
                            multiline
                            numberOfLines={10}
                            error={!!errors.issueMessage}
                            underlineStyle={{ backgroundColor: 'transparent' }}
                            style={{ height: 150, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8 }}
                        />
                        {errors.issueMessage && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors.issueMessage.message}</Text>}
                    </View>
                )}
            />
        </SupportSkeleton>

    );
}
