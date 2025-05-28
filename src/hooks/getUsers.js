import { useState, useCallback } from 'react';
// @react-navigation
import { useFocusEffect } from '@react-navigation/native';
// firebase
import { firestore, auth } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export function getUsers() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async (uid) => {
        setLoading(true);
        try {
            const userDocRef = doc(firestore, 'users', uid);
            const userSnapshot = await getDoc(userDocRef);
            const data = userSnapshot.data();

            setUserData(data || null);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error fetching user data.', text2: error.message || 'Please try again later.' });
            setUserData(null);
        }
        setLoading(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user?.uid) {
                    fetchUserData(user.uid);
                } else {
                    setUserData(null);
                    setLoading(false);
                }
            });

            return () => unsubscribe();
        }, [fetchUserData])
    );

    return { userData, loading };
}
