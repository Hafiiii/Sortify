import { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// firebase
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, firestore } from '../utils/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
// auth
import { useAuth } from '../context/AuthContext';
// components
import Toast from 'react-native-toast-message';
import palette from '../theme/palette';
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required').max(50, 'First Name cannot exceed 50 characters'),
    lastName: Yup.string().required('Last Name is required').max(50, 'Last Name cannot exceed 50 characters'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match').required('Confirm Password is required'),
});

// ----------------------------------------------------------------------

export default function AuthRegisterForm() {
    const { handleRegister } = useAuth();
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(RegisterSchema),
    });

    const handleRegisterAttempt = async (data) => {
        const { firstName, lastName, email, password } = data;

        setLoading(true);
        setError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const counterRef = doc(firestore, "counters", "usersCounter");

            const counterDocSnap = await getDoc(counterRef);
            let newId = 1;

            if (counterDocSnap.exists()) {
                newId = counterDocSnap.data().count + 1;
                await updateDoc(counterRef, { count: newId });
            } else {
                await setDoc(counterRef, { count: newId });
            }

            const userId = newId;

            await setDoc(doc(firestore, "users", user.uid), {
                uid: user.uid,
                userId,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email,
                photoURL: user.photoURL,
                dateJoined: new Date(),
                phoneNumber: "",
                gender: "",
                birthday: "",
                totalPoints: 0,
            });

            // await sendEmailVerification(user);

            navigation.navigate("Login");
            Toast.show({ type: 'success', text1: 'Registration Successful.', text2: 'Login to your account now.' });
            handleRegister();
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Error during registration.', text2: err.message || 'Please try again later.' });
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={{ marginBottom: 10 }}>
                        <TextInput
                            label="First Name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.firstName}
                            underlineStyle={{ backgroundColor: 'transparent' }}
                            style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 50 }}
                        />
                        {errors.firstName && <Text style={{ color: palette.error.main, marginBottom: -9, fontSize: 10 }}>{errors.firstName.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={{ marginBottom: 10 }}>
                        <TextInput
                            label="Last Name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.lastName}
                            underlineStyle={{ backgroundColor: 'transparent' }}
                            style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 50 }}
                        />
                        {errors.lastName && <Text style={{ color: palette.error.main, marginBottom: -9, fontSize: 10 }}>{errors.lastName.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={{ marginBottom: 10 }}>
                        <TextInput
                            label="Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            error={!!errors.email}
                            underlineStyle={{ backgroundColor: 'transparent' }}
                            style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 50 }}
                        />
                        {errors.email && <Text style={{ color: palette.error.main, marginBottom: -9, fontSize: 10 }}>{errors.email.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={{ marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                label="Password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={!showPassword}
                                error={!!errors.password}
                                underlineStyle={{ backgroundColor: 'transparent' }}
                                style={{ flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 50 }}
                            />
                            <Iconify
                                icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                                onPress={() => setShowPassword(!showPassword)}
                                size={24}
                                style={{ marginLeft: -40, marginRight: 15, color: palette.disabled.main }}
                            />
                        </View>
                        {errors.password && <Text style={{ color: palette.error.main, marginBottom: -9, fontSize: 10 }}>{errors.password.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={{ marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                label="Confirm Password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={!showPassword}
                                error={!!errors.confirmPassword}
                                underlineStyle={{ backgroundColor: 'transparent' }}
                                style={{ flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 50 }}
                            />
                            <Iconify
                                icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                                onPress={() => setShowPassword(!showPassword)}
                                size={24}
                                style={{ marginLeft: -40, marginRight: 15, color: palette.disabled.main }}
                            />
                        </View>
                        {errors.confirmPassword && <Text style={{ color: palette.error.main, marginBottom: -9, fontSize: 10 }}>{errors.confirmPassword.message}</Text>}
                    </View>
                )}
            />

            {/* {error && <Text style={{ color: palette.error.main, fontSize: 10, textAlign: 'center' }}>{error}</Text>} */}

            <Button
                mode="contained"
                onPress={handleSubmit(handleRegisterAttempt)}
                loading={loading}
                disabled={loading}
                style={{ backgroundColor: '#000' }}
                labelStyle={{ color: '#fff' }}
            >
                Register
            </Button>
        </View>
    );
}