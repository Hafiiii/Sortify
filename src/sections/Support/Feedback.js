import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// hooks
import { getUsers } from '../../hooks/getUsers';
// firebase
import { firestore } from '../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
// components
import Toast from 'react-native-toast-message';
import palette from '../../theme/palette';
import SupportSkeleton from './SupportSkeleton';

// ----------------------------------------------------------------------

const FeedbackSchema = Yup.object().shape({
    name: Yup.string().when('isAnonymous', { is: false, then: Yup.string().required('Name is required'), }),
    email: Yup.string().when('isAnonymous', { is: false, then: Yup.string().required('Email is required').email('Invalid email format'), }),
    feedback: Yup.string().required('Feedback is required').min(10, 'Feedback must be at least 10 characters'),
    rating: Yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

// ----------------------------------------------------------------------

export default function Feedback() {
    const { userData } = getUsers();
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

    useEffect(() => {
        if (userData) {
            if (userData.firstName) setValue('name', userData.firstName);
            if (userData.email) setValue('email', userData.email);
        }
    }, [userData, setValue]);

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
        <SupportSkeleton
            title="We Value Your Feedback"
            description="Your feedback helps us improve our services. Please share your thoughts and suggestions."
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={handleFeedbackSubmit}
            loading={loading}
            includeRating
            rating={rating}
            setRating={setRating}
            includeAnonymous
            isAnonymous={isAnonymous}
            setIsAnonymous={setIsAnonymous}
        >
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
        </SupportSkeleton>

    );
}
