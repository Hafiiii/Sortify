import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
// context
import { AuthProvider } from './src/context/AuthContext';
// @react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// screens
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import ScanScreen from './src/screens/ScanScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfile from './src/sections/Profile/EditProfile';
import TermsOfService from './src/sections/TermsOfService/TermsOfService';
import PrivacyPolicy from './src/sections/PrivacyPolicy/PrivacyPolicy';
// auth
import { useAuth } from './src/context/AuthContext';
// components
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './src/theme';
import BottomBar from './src/components/BottomBar/BottomBar';
import { Iconify } from 'react-native-iconify';
import palette from './src/theme/palette';

// ----------------------------------------------------------------------

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

const BottomTabNavigator = () => {
  const { user } = useAuth();
  console.log('user', user);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          borderRadius: 20,
          height: 60,
          backgroundColor: '#000',
          marginHorizontal: 15,
          paddingTop: 10,
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
          display: ['Scan', 'History'].includes(route.name) ? 'none' : 'flex',
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: palette.primary.main,
        tabBarInactiveTintColor: '#fff',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Iconify icon="mingcute:home-1-fill" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Iconify icon="mdi:lightbulb" color={color} size={size} />,
        }}
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
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Iconify icon="maki:waste-basket" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={user ? ProfileScreen : LoginScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Iconify icon="iconamoon:profile-fill" color={color} size={size} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault(); // Prevent navigation
              navigation.navigate('Login'); // Redirect to login
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};


const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Main" component={BottomTabNavigator} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
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