import { useState, useEffect } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Switch } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// auth
import { useAuth } from '../context/AuthContext';
// firebase
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
// components
import Toast from 'react-native-toast-message';
import StarRating from '../components/StarRating/StarRating';
import palette from '../theme/palette';
import { Iconify } from 'react-native-iconify';
import { ReturnButton } from '../components/GoBackButton/GoBackButton';

// ----------------------------------------------------------------------

const FeedbackSchema = Yup.object().shape({
    name: Yup.string().when('isAnonymous', { is: false, then: Yup.string().required('Name is required'), }),
    email: Yup.string().when('isAnonymous', { is: false, then: Yup.string().required('Email is required').email('Invalid email format'), }),
    feedback: Yup.string().required('Feedback is required').min(10, 'Feedback must be at least 10 characters'),
    rating: Yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

// ----------------------------------------------------------------------

export default function FeedbackScreen() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const { control, handleSubmit, setError: setFieldError, formState: { errors }, getValues, reset, setValue } = useForm({
        resolver: yupResolver(FeedbackSchema),
        defaultValues: {
            feedback: '',
            name: '',
            email: '',
            isAnonymous: false,
        },
    });


    const fetchUserData = async () => {
        if (!user?.uid) return;

        try {
            const userDocRef = doc(firestore, 'users', user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {
                const data = userSnapshot.data();
                setUserData(data);
                if (data.firstName) setValue('name', data.firstName);
                if (data.email) setValue('email', data.email);
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error fetching user data', text2: error.message || 'Please try again later.' });
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [user, setValue]);

    const handleFeedbackSubmit = async () => {
        setLoading(true);
        const { feedback, name, email } = getValues();

        if (rating === 0) {
            setFieldError('rating', { type: 'manual', message: 'Rating is required' });
            setLoading(false);
            return;
        }

        const feedbackId = new Date().getTime().toString();
        const feedbackData = {
            feedbackId,
            feedback: feedback || '',
            name: isAnonymous ? 'Anonymous' : name || '',
            email: isAnonymous ? '' : email || '',
            rating,
            timestamp: new Date(),
        };

        try {
            const feedbackDocRef = doc(firestore, 'feedbacks', feedbackId);
            await setDoc(feedbackDocRef, feedbackData);

            Toast.show({ type: 'success', text1: 'Feedback Submitted', text2: 'Thank you for your feedback!' });

            setRating(0);
            setIsAnonymous(false);
            reset();
            fetchUserData();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Submission Failed', text2: error.message || 'Please try again later.' });
        } finally {
            setLoading(false);
        }
    };


    return (
        <ScrollView contentContainerStyle={{ padding: 30 }} showsVerticalScrollIndicator={false}>
            <ReturnButton />

            <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <Image source={require('../../assets/sortify-logo.png')} style={{ width: 60, height: 75, marginBottom: 20 }} resizeMode="contain" />
                <Text style={{ fontSize: 20, fontWeight: '900', marginBottom: 10 }}>We Value Your Feedback</Text>
                <Text style={{ color: palette.disabled.secondary, marginBottom: 10, textAlign: 'justify', lineHeight: 22 }}>
                    Your feedback helps us improve our services. Please share your thoughts and suggestions.
                </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <Text>Want to remain anonymous?</Text>
                <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
            </View>

            <StarRating rating={rating} setRating={setRating} />
            {errors.rating && <Text style={{ color: palette.error.main }}>{errors.rating.message}</Text>}

            {!isAnonymous && (
                <>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <View style={{ marginBottom: 15 }}>
                                <TextInput
                                    label="Name"
                                    value={value}
                                    onChangeText={onChange}
                                    error={!!errors.name}
                                    underlineStyle={{ backgroundColor: 'transparent' }}
                                    style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 45 }}
                                />
                                {errors.name && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors.name.message}</Text>}
                            </View>
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <View style={{ marginBottom: 15 }}>
                                <TextInput
                                    label="Email"
                                    value={value}
                                    onChangeText={onChange}
                                    keyboardType="email-address"
                                    error={!!errors.email}
                                    underlineStyle={{ backgroundColor: 'transparent' }}
                                    style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 45 }}
                                />
                                {errors.email && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors.email.message}</Text>}
                            </View>
                        )}
                    />
                </>
            )}

            <Controller
                name="feedback"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <View style={{ marginBottom: 15 }}>
                        <TextInput
                            label="Feedback"
                            value={value}
                            onChangeText={onChange}
                            multiline
                            numberOfLines={4}
                            error={!!errors.feedback}
                            underlineStyle={{ backgroundColor: 'transparent' }}
                            style={{ height: 80, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8 }}
                        />
                        {errors.feedback && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors.feedback.message}</Text>}
                    </View>
                )}
            />

            <Button
                mode="contained"
                onPress={handleFeedbackSubmit}
                loading={loading}
                disabled={loading}
                style={{ backgroundColor: '#000' }}
                labelStyle={{ color: '#fff' }}
            >
                Submit Feedback
            </Button>
        </ScrollView>
    );
}
