import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
// context
import { AuthProvider } from './src/context/AuthContext';
// @react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// screens
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TermsOfService from './src/sections/TermsOfService/TermsOfService';
import PrivacyPolicy from './src/sections/PrivacyPolicy/PrivacyPolicy';
// components
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './src/theme';

// ----------------------------------------------------------------------

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#80b564',
  },
  fonts: {
    ...DefaultTheme.fonts,
    default: {
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      letterSpacing: 0,
    },
  },
};

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="TermsOfService" component={TermsOfService} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
  </Stack.Navigator>
);

// ----------------------------------------------------------------------

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <ThemeProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
          <Toast />
        </ThemeProvider>
      </AuthProvider>
    </PaperProvider>
  );
}