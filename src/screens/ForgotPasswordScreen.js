import { useState } from 'react';
import { View, Dimensions, ImageBackground } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// firebase
import { auth } from '../utils/firebase';
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";
// components
import Toast from 'react-native-toast-message';
import palette from '../theme/palette';
import { ReturnButton } from '../components/GoBackButton/GoBackButton';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

const AccountSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Invalid email format'),
});

// ----------------------------------------------------------------------

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(AccountSchema),
    });

    const handleResetPassword = async (data) => {
        setLoading(true);
        try {
            const methods = await fetchSignInMethodsForEmail(auth, data.email);

            if (methods.length === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Email Not Found',
                    text2: 'No account is associated with this email.'
                });
                setLoading(false);
                return;
            }

            await sendPasswordResetEmail(auth, data.email);

            Toast.show({ type: 'success', text1: 'Reset Email Sent', text2: 'Check your inbox to reset your password.' });
            navigation.navigate("PasswordReset");
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error sending reset email', text2: error.message || 'Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/sortify-logo-half-bg.webp')}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            resizeMode="cover"
            imageStyle={{ opacity: 0.6 }}
        >
            <View style={{ flex: 1, width: width, height: height, padding: 40 }}>
                <ReturnButton />

                <Text style={{ fontSize: 22, fontWeight: 700 }}>Forgot Password?</Text>
                <Text style={{ marginTop: 10, marginBottom: 20, fontSize: 12 }}>Please enter the email associated with your account.</Text>

                <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={{ marginBottom: 20 }}>
                            <TextInput
                                placeholder="Enter your email here"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="email-address"
                                error={!!errors.email}
                                underlineStyle={{ backgroundColor: 'transparent' }}
                                style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 50 }}
                            />
                            {errors.email && <Text style={{ color: palette.error.main, marginBottom: -9, fontSize: 10 }}>{errors.email.message}</Text>}
                        </View>
                    )}
                />

                <Button
                    mode="contained"
                    onPress={handleSubmit(handleResetPassword)}
                    loading={loading}
                    disabled={loading}
                    style={{ backgroundColor: '#000' }}
                    labelStyle={{ color: '#fff' }}
                >
                    Reset Password
                </Button>
            </View>
        </ImageBackground>
    );
}