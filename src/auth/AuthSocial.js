import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { auth, firestore, storage } from '../utils/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// auth
import { useAuth } from '../context/AuthContext';
// components
import { WEB_CLIENT_ID } from '@env';
import { Iconify } from 'react-native-iconify';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';

// ----------------------------------------------------------------------

GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    forceCodeForRefreshToken: true,
});

// ----------------------------------------------------------------------

export default function AuthSocial() {
    const navigation = useNavigation();
    const { handleLogin } = useAuth();

    async function uploadProfileImage(photoURL, uid) {
        try {
            const localFilePath = `${RNFS.CachesDirectoryPath}/${uid}.jpg`;

            const downloadResult = await RNFS.downloadFile({
                fromUrl: photoURL,
                toFile: localFilePath,
            }).promise;

            if (downloadResult.statusCode !== 200) {
                throw new Error('Failed to download image');
            }

            const response = await fetch('file://' + localFilePath);
            const blob = await response.blob();
            const storageRef = ref(storage, `profile_images/${uid}.jpg`);

            await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(storageRef);

            await RNFS.unlink(localFilePath);

            return downloadURL;
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Image Upload Error', text2: error.message || 'Please try again later.' });
            return null;
        }
    }

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

            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, googleCredential);
            const user = userCredential.user;

            const fullName = user.displayName || "";
            const nameParts = fullName.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
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

                let finalPhotoURL = user.photoURL;

                if (user.photoURL) {
                    const uploadedPhotoURL = await uploadProfileImage(user.photoURL, user.uid);
                    if (uploadedPhotoURL) {
                        finalPhotoURL = uploadedPhotoURL;
                    }
                }

                await setDoc(userRef, {
                    uid: user.uid,
                    userId,
                    firstName,
                    lastName,
                    email: user.email,
                    photoURL: finalPhotoURL,
                    dateJoined: new Date(),
                    phoneNumber: "",
                    gender: "",
                    birthday: "",
                    totalPoints: 0,
                    totalScore: 0,
                });
            }

            Toast.show({ type: 'success', text1: 'Google Signin Successful' });
            await new Promise(resolve => setTimeout(resolve, 1000));
            handleLogin(user);
            navigation.navigate("Main", { screen: "HomeStack", params: { screen: "Home" } });
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Google Sign-In Error.', text2: error.message || 'Please try again later.' });
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