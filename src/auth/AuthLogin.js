import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
// auth
import { useAuth } from '../context/AuthContext';
// components
import Toast from 'react-native-toast-message';
import palette from '../theme/palette';
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email format'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const navigation = useNavigation();
  const { handleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, setError: setFieldError, formState: { errors } } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const handleLoginAttempt = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);


      if (userSnap.exists()) {
        const userData = userSnap.data();
        const userId = userData.userId;

        Toast.show({ type: 'success', text1: 'Login Successful' });
        handleLogin();

        if (userId <= 5) {
          navigation.navigate("UserCMS");
        } else {
          navigation.navigate("Main", { screen: "HomeStack", params: { screen: "Home" } });
        }
      } else {
        Toast.show({ type: 'error', text1: 'User profile not found in database.', text2: error.message || 'Please contact support.' });
      }

    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error during login.', text2: err.message || 'Please try again later.' });
      setError(err.message);
      setFieldError("afterSubmit", { message: "Incorrect email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ marginBottom: 20 }}>
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
        name="password"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ marginBottom: 8 }}>
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

      <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={{ fontSize: 12, color: palette.disabled.main }}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* {error && <Text style={{ color: palette.error.main, fontSize: 10, textAlign: 'center' }}>{error}</Text>} */}

      <Button
        mode="contained"
        onPress={handleSubmit(handleLoginAttempt)}
        loading={loading}
        disabled={loading}
        style={{ backgroundColor: '#000' }}
        labelStyle={{ color: '#fff' }}
      >
        Login
      </Button>
    </View>
  );
}
