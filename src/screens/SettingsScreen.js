import { View, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
// @react-navigation
import { useNavigation, Link } from '@react-navigation/native';
// components
import palette from '../theme/palette';
import { GoBackButton } from '../components/GoBackButton/GoBackButton';

// ----------------------------------------------------------------------

export default function SettingsScreen() {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={{ padding: 30, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
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

            <Text style={{ textAlign: 'center', marginTop: 20, color: palette.disabled.secondary }}>Need Help? <Link screen="ContactUs" style={{ color: palette.disabled.secondary, fontWeight: 700, textDecorationLine: 'underline', textDecorationColor: '#000' }}>CONTACT US</Link></Text>
        </ScrollView>
    );
};