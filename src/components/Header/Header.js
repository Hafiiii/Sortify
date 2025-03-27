import { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { firestore } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
// auth
import { useAuth } from '../../context/AuthContext';
// components
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

export function Header({ title, style }) {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserPhoto = async () => {
            if (!user?.uid) {
                setLoading(false);
                return;
            }

            try {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userSnapshot = await getDoc(userDocRef);
                setUserData({ photoURL: userSnapshot.data().photoURL });

            } catch (error) {
                console.error('Error fetching user photoURL:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPhoto();
    }, [user]);

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
            <Text style={[{ fontSize: 16 }, style]}>{title}</Text>
            {userData?.photoURL && (
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image
                        source={{ uri: userData.photoURL }}
                        style={{ width: 40, height: 40, borderRadius: 50 }}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

export function HeaderTriple({ title, style }) {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserPhoto = async () => {
            if (!user?.uid) {
                setLoading(false);
                return;
            }

            try {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userSnapshot = await getDoc(userDocRef);
                setUserData({ photoURL: userSnapshot.data().photoURL });

            } catch (error) {
                console.error('Error fetching user photoURL:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPhoto();
    }, [user]);

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
            <Iconify icon="ri:arrow-left-s-line" size={30} />
            <Text style={[{ fontSize: 16 }, style]}>{title}</Text>
            {userData?.photoURL && (
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image
                        source={{ uri: userData.photoURL }}
                        style={{ width: 40, height: 40, borderRadius: 50 }}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}