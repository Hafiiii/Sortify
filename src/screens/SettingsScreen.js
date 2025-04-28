import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
// @react-navigation
import { useNavigation, Link } from '@react-navigation/native';
// components
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';

// ----------------------------------------------------------------------

export default function SettingsScreen() {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={{ padding: 30, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Iconify
                        icon={'ri:arrow-left-s-line'}
                        size={26}
                        style={{ marginRight: 2, color: '#000' }}
                    />
                </TouchableOpacity>

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