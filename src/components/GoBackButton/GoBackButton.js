import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// components
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

export default function GoBackButton() {
    const navigation = useNavigation();

    return (
        <Button
            onPress={() => navigation.goBack()}
            mode='text'
            rippleColor="transparent"
            style={{
                marginLeft: -20,
                width: 90,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Iconify icon="ri:arrow-left-s-line" size={20} />
                <Text style={{ fontSize: 12, fontWeight: '700', marginLeft: 2 }}>Return</Text>
            </View>
        </Button>
    );
};