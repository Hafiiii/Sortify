import { useState } from 'react';
import { View, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { RadioButton, Text, Button } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { auth, firestore } from '../../utils/firebase';
import { deleteUser } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
// components
import Toast from 'react-native-toast-message';
import palette from '../../theme/palette';
import { ReturnButton } from '../../components/GoBackButton/GoBackButton';

// ----------------------------------------------------------------------

const reasons = [
    { label: 'I’m no longer using my account', value: 'No longer using my account' },
    { label: 'I have multiple accounts', value: 'Have multiple accounts' },
    { label: 'I don’t understand how to use', value: 'Don’t understand how to use' },
    { label: 'Concerned about my privacy and data security', value: 'Privacy and data security' },
    { label: 'I’m experiencing too many technical problems', value: 'Too many technical problems' },
    { label: 'Other', value: 'Other' }
];

// ----------------------------------------------------------------------

export default function DeleteAccount() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);

    const handleDeleteAccount = async () => {
        const userAcc = auth.currentUser;

        if (!selectedReason) {
            Toast.show({ type: 'error', text1: 'Please select a reason for deletion.' });
            return;
        }

        try {
            setLoading(true);

            if (!userAcc) {
                Toast.show({ type: 'error', text1: 'No user is logged in', text2: 'Please log in to delete your account.' });
            }

            const userRef = doc(firestore, 'users', userAcc.uid);
            await updateDoc(userRef, {
                isDeleted: true,
                deleteReason: selectedReason,
            });

            await deleteUser(userAcc);

            Toast.show({ type: 'success', text1: 'Account deleted successfully!' });
            navigation.navigate('Login');
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error deleting account. Please try again later.', text2: error.message || 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    const showAlert = () => {
        Alert.alert(
            'Are you sure?',
            'This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                { text: 'Delete', onPress: handleDeleteAccount },
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={{ flex: 1, padding: 30 }} showsVerticalScrollIndicator={false}>
            <ReturnButton />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../../../assets/sortify-logo-delete.png')}
                    style={{
                        width: 60,
                        height: 75,
                        marginBottom: 20,
                    }}
                    resizeMode="contain"
                />

                <Text style={{ fontSize: 20, fontWeight: 900, marginBottom: 15 }}>DELETE SORTIFY ACCOUNT?</Text>

                <Text style={{ color: palette.disabled.secondary, marginBottom: 20, textAlign: 'justify', lineHeight: 25 }}>
                    This action will be permanently erase all of your information and you will not be able to recover it. If you
                    have any issues, please <TouchableOpacity onPress={() => navigation.navigate("ContactUs")}>
                        <Text style={{ color: '#000', textDecorationLine: 'underline', textDecorationColor: '#000', marginBottom: -8 }}>CONTACT US</Text>
                    </TouchableOpacity>.
                </Text>


                <View style={{ marginBottom: 15 }}>
                    <Text style={{ marginBottom: 10 }}>Please select a reason:</Text>
                    {reasons.map((reason) => (
                        <View key={reason.value} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7 }}>
                            <RadioButton
                                value={reason.value}
                                status={selectedReason === reason.value ? 'checked' : 'unchecked'}
                                onPress={() => setSelectedReason(reason.value)}
                            />
                            <Text>{reason.label}</Text>
                        </View>
                    ))}
                </View>

                <Button
                    mode="contained"
                    onPress={showAlert}
                    loading={loading}
                    disabled={loading}
                    style={{ backgroundColor: '#000' }}
                    labelStyle={{ color: '#fff' }}
                >
                    Delete Account
                </Button>
            </View>
        </ScrollView>
    );
};
