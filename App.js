import React, { lazy, Suspense } from 'react';
import { TouchableOpacity } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
// context
import { AuthProvider, useAuth } from './src/context/AuthContext';
// hooks
import { getUsers } from './src/hooks/getUsers';
// @react-navigation
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// screens
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
const ForgotPasswordScreen = lazy(() => import('./src/screens/ForgotPasswordScreen'));
const PasswordReset = lazy(() => import('./src/sections/Confirmation/PasswordReset'));

const SettingsScreen = lazy(() => import('./src/screens/SettingsScreen'));
const DeleteAccount = lazy(() => import('./src/sections/Settings/DeleteAccount'));

import HomeScreen from './src/screens/HomeScreen';
const CategoryObjects = lazy(() => import('./src/sections/Home/CategoryObjects'));
const ObjectDetail = lazy(() => import('./src/sections/Home/ObjectDetail'));

import ScanScreen from './src/screens/ScanScreen';
import HistoryScreen from './src/screens/HistoryScreen';
const StatisticsScreen = lazy(() => import('./src/screens/StatisticsScreen'));

import ActivitiesScreen from './src/screens/ActivitiesScreen';
const Leaderboard = lazy(() => import('./src/sections/Leaderboard/Leaderboard'));
const Gamification = lazy(() => import('./src/sections/Gamification/Gamification'));
const Game = lazy(() => import('./src/sections/Gamification/Game'));
const RecyclingValue = lazy(() => import('./src/sections/RecyclingValue/RecyclingValue'));

import ProfileScreen from './src/screens/ProfileScreen';
const EditProfile = lazy(() => import('./src/sections/Profile/EditProfile'));

const Feedback = lazy(() => import('./src/sections/Support/Feedback'));
const ContactUs = lazy(() => import('./src/sections/Support/ContactUs'));
const TermsOfService = lazy(() => import('./src/sections/TermsOfService/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./src/sections/PrivacyPolicy/PrivacyPolicy'));

import UserCMS from './src/sections/Admin/UserCMS';
const WasteCMS = lazy(() => import('./src/sections/Admin/WasteCMS'));
const CategoryCMS = lazy(() => import('./src/sections/Admin/CategoryCMS'));
const ObjectCMS = lazy(() => import('./src/sections/Admin/ObjectCMS'));
const FeedbackCMS = lazy(() => import('./src/sections/Admin/FeedbackCMS'));
const IssueCMS = lazy(() => import('./src/sections/Admin/IssueCMS'));

// components
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './src/theme';
import { Iconify } from 'react-native-iconify';
import palette from './src/theme/palette';
import LoadingIndicator from './src/components/Animated/LoadingIndicator';
// test
let Upload, ScanTest;
if (__DEV__) {
  Upload = require('./src/test/Upload').default;
  ScanTest = require('./src/test/ScanTest').default;
}

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
    <HomeStack.Screen name="Gamification" component={Gamification} />
    <HomeStack.Screen name="Game" component={Game} />
    <HomeStack.Screen name="RecyclingValue" component={RecyclingValue} />
  </HomeStack.Navigator>
);

const BottomTabNavigator = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName="HomeStack" // Edit/Change
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;

        return {
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
            display: ['Scan', 'Game', 'Gamification'].includes(routeName) ? 'none' : 'flex',
          },
          tabBarShowLabel: false,
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: palette.primary.main,
          tabBarInactiveTintColor: '#fff',
          tabBarButton: (props) => <TouchableOpacity {...props} />
        };
      }}
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
    </Tab.Navigator >
  );
};

const AppNavigator = () => {
  const { userData, loading } = getUsers();
  const isAdmin = userData?.userId <= 5;

  if (loading) return <LoadingIndicator />

  return (
    <Stack.Navigator initialRouteName={isAdmin ? 'UserCMS' : 'Main'} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="PasswordReset" component={PasswordReset} />

      <Stack.Screen name="Main" component={BottomTabNavigator} />

      <Stack.Screen name="EditProfile" component={EditProfile} />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccount} />

      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="TermsOfService" component={TermsOfService} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />

      <Stack.Screen name="UserCMS" component={isAdmin ? UserCMS : HomeScreen} />
      <Stack.Screen name="WasteCMS" component={isAdmin ? WasteCMS : HomeScreen} />
      <Stack.Screen name="CategoryCMS" component={isAdmin ? CategoryCMS : HomeScreen} />
      <Stack.Screen name="ObjectCMS" component={isAdmin ? ObjectCMS : HomeScreen} />
      <Stack.Screen name="FeedbackCMS" component={isAdmin ? FeedbackCMS : HomeScreen} />
      <Stack.Screen name="IssueCMS" component={isAdmin ? IssueCMS : HomeScreen} />

      {__DEV__ && (
        <>
          <Stack.Screen name="Upload" component={Upload} />
          <Stack.Screen name="ScanTest" component={ScanTest} />
        </>
      )}
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
            <Suspense fallback={<LoadingIndicator />}>
              <AppNavigator />
            </Suspense>
          </NavigationContainer>
          <Toast />
        </ThemeProvider>
      </AuthProvider>
    </PaperProvider>
  );
}