import React from 'react';
import { View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, ActivityIndicator } from 'react-native-paper';
// context
import { AuthProvider } from './src/context/AuthContext';
// hooks
import { getUsers } from './src/hooks/getUsers';
// @react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// screens
import RegisterScreen from './src/screens/RegisterScreen';
import EmailVerification from './src/sections/Confirmation/EmailVerification';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import PasswordReset from './src/sections/Confirmation/PasswordReset';

import SettingsScreen from './src/screens/SettingsScreen';
import DeleteAccount from './src/sections/Settings/DeleteAccount';

import HomeScreen from './src/screens/HomeScreen';
import CategoryObjects from './src/sections/Home/CategoryObjects';
import ObjectDetail from './src/sections/Home/ObjectDetail';

import ScanScreen from './src/screens/ScanScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

import ActivitiesScreen from './src/screens/ActivitiesScreen';
import Leaderboard from './src/sections/Leaderboard/Leaderboard';

import ProfileScreen from './src/screens/ProfileScreen';
import EditProfile from './src/sections/Profile/EditProfile';

import FeedbackScreen from './src/screens/FeedbackScreen';
import ContactUs from './src/sections/ContactUs/ContactUs';
import TermsOfService from './src/sections/TermsOfService/TermsOfService';
import PrivacyPolicy from './src/sections/PrivacyPolicy/PrivacyPolicy';

import UserCMS from './src/sections/Admin/UserCMS';
import WasteCMS from './src/sections/Admin/WasteCMS';
import CategoryCMS from './src/sections/Admin/CategoryCMS';
import ObjectCMS from './src/sections/Admin/ObjectCMS';
// auth
import { useAuth } from './src/context/AuthContext';
// components
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './src/theme';
import { Iconify } from 'react-native-iconify';
import palette from './src/theme/palette';

import Upload from './src/screens/Upload';
import ScanTest from './src/screens/ScanTest';

// ----------------------------------------------------------------------

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#80b564',
  },
  backgroundColor: '#fff',
  fonts: {
    ...DefaultTheme.fonts,
    default: {
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      letterSpacing: 0,
    },
  },
};

const HomeStack = createStackNavigator();

const HomeStackNavigator = () => (
  <HomeStack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="CategoryObjects" component={CategoryObjects} />
    <HomeStack.Screen name="ObjectDetail" component={ObjectDetail} />
  </HomeStack.Navigator>
);

const ProfileStackNavigator = () => (
  <HomeStack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Profile" component={ProfileScreen} />
    <HomeStack.Screen name="Statistics" component={StatisticsScreen} />
  </HomeStack.Navigator>
);

const ActivitiesStackNavigator = () => (
  <HomeStack.Navigator initialRouteName="Activities" screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Activities" component={ActivitiesScreen} />
    <HomeStack.Screen name="Leaderboard" component={Leaderboard} />
  </HomeStack.Navigator>
);

const BottomTabNavigator = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName="HomeStack" // Edit/Change
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          borderRadius: 14,
          height: 60,
          backgroundColor: '#000',
          marginHorizontal: 15,
          paddingTop: 10,
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
          display: ['Scan'].includes(route.name) ? 'none' : 'flex',
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: palette.primary.main,
        tabBarInactiveTintColor: '#fff',
        tabBarButton: (props) => (
          <TouchableOpacity {...props} />
        ),
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Iconify icon="mingcute:home-1-fill" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ActivitiesStack"
        component={user ? ActivitiesStackNavigator : LoginScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Iconify icon="mdi:lightbulb" color={color} size={size} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              navigation.navigate('Login');
            }
          },
        })}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Iconify icon="ph:scan-bold" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={user ? HistoryScreen : LoginScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Iconify icon="maki:waste-basket" color={color} size={size} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              navigation.navigate('Login');
            }
          },
        })}
      />
      <Tab.Screen
        name="ProfileStack"
        component={user ? ProfileStackNavigator : LoginScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Iconify icon="iconamoon:profile-fill" color={color} size={size} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              navigation.navigate('Login');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { userData, loading } = getUsers();
  const isAdmin = userData?.userId <= 5;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={isAdmin ? 'ObjectCMS' : 'Main'} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="PasswordReset" component={PasswordReset} />

      <Stack.Screen name="Main" component={BottomTabNavigator} />

      <Stack.Screen name="EditProfile" component={EditProfile} />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccount} />

      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfService} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />

      <Stack.Screen name="UserCMS" component={isAdmin ? UserCMS : HomeScreen} />
      <Stack.Screen name="WasteCMS" component={isAdmin ? WasteCMS : HomeScreen} />
      <Stack.Screen name="CategoryCMS" component={isAdmin ? CategoryCMS : HomeScreen} />
      <Stack.Screen name="ObjectCMS" component={isAdmin ? ObjectCMS : HomeScreen} />

      <Stack.Screen name="Upload" component={Upload} />
      <Stack.Screen name="ScanTest" component={ScanTest} />
    </Stack.Navigator>
  );
}

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