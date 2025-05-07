import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// hooks
import { getUsers } from '../../hooks/getUsers';
// components
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

export function Header({ title, style }) {
    const navigation = useNavigation();
    const { userData } = getUsers();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
            <Text style={[{ fontSize: 16 }, style]}>{title}</Text>
            {userData?.photoURL && (
                <TouchableOpacity onPress={() => navigation.navigate("ProfileStack", { screen: "Profile" })}>
                    <Image source={{ uri: userData.photoURL }} style={{ width: 40, height: 40, borderRadius: 50 }} />
                </TouchableOpacity>
            )}
        </View>
    );
}

export function HeaderTriple({ title, style, boxStyle }) {
    const navigation = useNavigation();
    const { userData } = getUsers();

    return (
        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }, boxStyle]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Iconify icon="ri:arrow-left-s-line" size={30} />
            </TouchableOpacity>

            <Text style={[{ fontSize: 16 }, style]}>{title}</Text>

            {userData?.photoURL ? (
                <TouchableOpacity onPress={() => navigation.navigate("ProfileStack", { screen: "Profile" })}>
                    <Image source={{ uri: userData.photoURL }} style={{ width: 40, height: 40, borderRadius: 50 }} />
                </TouchableOpacity>
            ) : (
                <View style={{ width: 30 }} />
            )}
        </View>
    );
}