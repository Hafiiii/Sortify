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
import { useAuth } from '../../context/AuthContext';
// firebase
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
// components
import Toast from 'react-native-toast-message';
import palette from '../../theme/palette';
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

const IssuesSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    issueMessage: Yup.string().required('Please describe your issue').min(10, 'Issue description must be at least 10 characters'),
});

// ----------------------------------------------------------------------

export default function ContactUsScreen() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, setError: setFieldError, formState: { errors }, getValues, reset, setValue } = useForm({
        resolver: yupResolver(IssuesSchema),
        defaultValues: {
            name: '',
            email: '',
            issueMessage: '',
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
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [user, setValue]);

    const handleIssuesSubmit = async () => {
        setLoading(true);
        const { issueMessage, name, email } = getValues();

        const issuesId = new Date().getTime().toString();
        const issuesData = {
            issuesId,
            issueMessage: issueMessage || '',
            name,
            email,
            timestamp: new Date(),
        };

        try {
            const issuesDocRef = doc(firestore, 'issues', issuesId);
            await setDoc(issuesDocRef, issuesData);

            Toast.show({
                type: 'success',
                text1: 'Your Concern is Submitted',
                text2: 'Thank you for reaching out to us. We will get back to you soon!',
            });

            reset();
            fetchUserData();
        } catch (error) {
            console.error("Error saving contact issue: ", error);
            Toast.show({
                type: 'error',
                text1: 'Submission Failed',
                text2: 'An error occurred while submitting your issue.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 30 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <Iconify icon={'ri:arrow-left-s-line'} size={20} style={{ marginRight: 2, color: '#000' }} />
                    <Text style={{ fontSize: 12, fontWeight: '700' }}>Return</Text>
                </View>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <Image source={require('../../../assets/sortify-logo.png')} style={{ width: 60, height: 75, marginBottom: 20 }} resizeMode="contain" />
                <Text style={{ fontSize: 20, fontWeight: '900', marginBottom: 10 }}>Contact Us</Text>
                <Text style={{ color: palette.disabled.secondary, marginBottom: 10, textAlign: 'justify', lineHeight: 22 }}>
                    Please let us know if you're facing any issues with the app. We are here to help!
                </Text>
            </View>

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
                            numberOfLines={4}
                            error={!!errors.issueMessage}
                            underlineStyle={{ backgroundColor: 'transparent' }}
                            style={{ height: 80, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8 }}
                        />
                        {errors.issueMessage && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors.issueMessage.message}</Text>}
                    </View>
                )}
            />

            <Button
                mode="contained"
                onPress={handleIssuesSubmit}
                loading={loading}
                disabled={loading}
                style={{ backgroundColor: '#000' }}
                labelStyle={{ color: '#fff' }}
            >
                Submit Issue
            </Button>
        </ScrollView>
    );
}
