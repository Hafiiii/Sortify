import { useState } from 'react';
import { View, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Menu } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// hooks
import { getUsers } from '../../hooks/getUsers';
// firebase
import { auth } from '../../utils/firebase';
import { signOut } from 'firebase/auth';
// components
import { GoBackButton } from '../GoBackButton/GoBackButton';
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

export function Header({ title, style }) {
    const navigation = useNavigation();
    const { userData } = getUsers();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
            <Text style={[{ fontSize: 16 }, style]}>{title}</Text>
            {userData?.photoURL && (
                <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "ProfileStack", params: { screen: "Profile" } })}>
                    <Image source={{ uri: userData.photoURL }} style={{ width: 40, height: 40, borderRadius: 50 }} />
                </TouchableOpacity>
            )}
        </View>
    );
}

export function HeaderTriple({ title, style, boxStyle, iconColor}) {
    const navigation = useNavigation();
    const { userData } = getUsers();

    return (
        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }, boxStyle]}>
            <GoBackButton iconColor={iconColor} />

            <Text style={[{ fontSize: 16 }, style]}>{title}</Text>

            {userData?.photoURL ? (
                <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "ProfileStack", params: { screen: "Profile" } })}>
                    <Image source={{ uri: userData.photoURL }} style={{ width: 40, height: 40, borderRadius: 50 }} />
                </TouchableOpacity>
            ) : (
                <View style={{ width: 30 }} />
            )}
        </View>
    );
}

export function HeaderAdmin({ title, style, boxStyle }) {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            navigation.navigate("Main", { screen: "HomeStack", params: { screen: "Home" } });
                        } catch (error) {
                            Toast.show({ type: 'error', text1: 'Error signing out.', text2: error.message || 'Please try again later.' });
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, boxStyle]}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity onPress={openMenu} style={{ padding: 10 }}>
                        <Iconify
                            icon={'material-symbols:menu'}
                            size={16}
                        />
                    </TouchableOpacity>
                }
                contentStyle={{ width: 200, backgroundColor: '#fff' }}
            >
                <Menu.Item onPress={() => navigation.navigate('UserCMS')} title="User" />
                <Menu.Item onPress={() => navigation.navigate('WasteCMS')} title="Waste" />
                <Menu.Item onPress={() => navigation.navigate('CategoryCMS')} title="Category" />
                <Menu.Item onPress={() => navigation.navigate('ObjectCMS')} title="Object" />
                <Menu.Item onPress={() => navigation.navigate('FeedbackCMS')} title="Feedback" />
                <Menu.Item onPress={() => navigation.navigate('IssueCMS')} title="Issue" />
            </Menu>

            <Text style={[{ fontSize: 16, textTransform: 'capitalize' }, style]}>{title}</Text>

            <TouchableOpacity onPress={handleLogout} style={{ padding: 10 }}>
                <Iconify icon={'material-symbols:logout'} size={16} />
            </TouchableOpacity>
        </View >
    );
}