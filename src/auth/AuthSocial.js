import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import auth from '@react-native-firebase/auth';
import { firestore } from '../utils/firebase';
import { doc, setDoc, getDoc, runTransaction } from 'firebase/firestore';
// auth
import { useAuth } from '../context/AuthContext';
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
    const { handleLogin } = useAuth();

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

            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);

            let userId;

            if (userDoc.exists()) {
                userId = userDoc.data().userId;
            } else {
                const counterRef = doc(firestore, "counters", "usersCounter");

                const userId = await runTransaction(firestore, async (transaction) => {
                    const counterDoc = await transaction.get(counterRef);
                    let newId = 1;

                    if (counterDoc.exists()) {
                        newId = counterDoc.data().count + 1;
                    } else {
                        transaction.set(counterRef, { count: newId });
                    }

                    transaction.update(counterRef, { count: newId });

                    return newId;
                });

                await setDoc(userRef, {
                    uid: user.uid,
                    userId,
                    firstName,
                    lastName,
                    email: user.email,
                    photoURL: user.photoURL,
                    dateJoined: new Date(),
                    phoneNumber: "",
                    gender: "",
                    birthday: "",
                    totalPoints: "",
                    savedCO: "",
                    totalWaste: "",
                });
            }

            Toast.show({
                type: 'success',
                text1: 'Google Signin Successful',
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            handleLogin(user);
            navigation.navigate("Main", { screen: "Home" });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Google Sign-In Error.',
                text2: error.message,
            });
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