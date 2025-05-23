import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Toast from 'react-native-toast-message';

export function getUsers() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            if (user?.uid) {
                try {
                    const userDocRef = doc(firestore, 'users', user.uid);
                    const userSnapshot = await getDoc(userDocRef);
                    const data = userSnapshot.data();

                    if (data) {
                        setUserData(data);
                    } else {
                        setUserData(null);
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error fetching user data.',
                    });
                    setUserData(null);
                }
            } else {
                // User is signed out
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { userData, loading };
}
