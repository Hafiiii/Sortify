import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import auth from '@react-native-firebase/auth';
import { firestore } from '../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
// components
import { WEB_CLIENT_ID } from '@env';
import { Iconify } from 'react-native-iconify';
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    forceCodeForRefreshToken: true,
});

// ----------------------------------------------------------------------

export default function AuthSocial() {
    const navigation = useNavigation();

    async function onGoogleButtonPress() {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            await GoogleSignin.signOut();
            const signInResult = await GoogleSignin.signIn();

            idToken = signInResult.data?.idToken;
            if (!idToken) {
                idToken = signInResult.idToken;
            }
            if (!idToken) {
                throw new Error('No ID token found');
            }

            const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.idToken);
            const userCredential = await auth().signInWithCredential(googleCredential);
            const user = userCredential.user;

            const fullName = user.displayName || "";
            const nameParts = fullName.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            await setDoc(doc(firestore, "users", user.uid), {
                uid: user.uid,
                firstName,
                lastName,
                email: user.email,
                photoURL: user.photoURL,
                dateJoined: new Date(),
            });

            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
            });

            console.log('User', user);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Google Sign-In Error:', error);
        }
    }

    return (
        <Button
            onPress={onGoogleButtonPress}
            mode='outlined'
            style={{ borderRadius: 8 }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Iconify icon="flat-color-icons:google" size={20} />
                <Text style={{ fontWeight: 800, marginLeft: 10 }}>
                    Sign In with Google
                </Text>
            </View>
        </Button>
    );
}