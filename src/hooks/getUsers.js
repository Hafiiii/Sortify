import { useState, useCallback } from 'react';
// @react-navigation
import { useFocusEffect } from '@react-navigation/native';
// firebase
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
// auth
import { useAuth } from '../context/AuthContext';
// components
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

export function getUsers() {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchUserData = async () => {
                if (!user?.uid) {
                    setLoading(false);
                    return;
                }

                setLoading(true);

                try {
                    const userDocRef = doc(firestore, 'users', user.uid);
                    const userSnapshot = await getDoc(userDocRef);
                    const data = userSnapshot.data();

                    if (data) {
                        setUserData(data);
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error fetching user data.',
                    });
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();

            return () => { };
        }, [user?.uid])
    );

    return { userData, loading };
}