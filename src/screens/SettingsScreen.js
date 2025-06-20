import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// components
import palette from '../theme/palette';
import { GoBackButton } from '../components/GoBackButton/GoBackButton';

// ----------------------------------------------------------------------

export default function SettingsScreen() {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: '#fff', padding: 30 }} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <GoBackButton />

                <Text style={{ fontSize: 20, fontWeight: 700 }}>Settings</Text>
            </View>

            <Button
                mode='outlined'
                onPress={() => { navigation.navigate('ForgotPassword') }}
                style={{ borderRadius: 5, padding: 3, backgroundColor: 'transparent', marginBottom: 10 }}
                labelStyle={{ color: '#000' }}
            >
                Change Password
            </Button>

            <Button
                mode='outlined'
                onPress={() => { navigation.navigate('Feedback') }}
                style={{ borderRadius: 5, padding: 3, backgroundColor: 'transparent', marginBottom: 10 }}
                labelStyle={{ color: '#000' }}
            >
                Send Feedback
            </Button>

            <Button
                mode='outlined'
                onPress={() => { navigation.navigate('DeleteAccount') }}
                style={{ borderRadius: 5, padding: 3, backgroundColor: 'transparent', marginBottom: 10 }}
                labelStyle={{ color: '#000' }}
            >
                Delete Account
            </Button>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                <Text style={{ textAlign: 'center', color: palette.disabled.secondary }}>Need Help? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('ContactUs')} >
                    <Text style={{ color: palette.disabled.secondary, textDecorationLine: 'underline' }}>
                        CONTACT US
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};