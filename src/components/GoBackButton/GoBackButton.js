import { View, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// components
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

export function ReturnButton({ size = 20 }) {
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
                <Iconify icon="ri:arrow-left-s-line" size={size} />
                <Text style={{ fontSize: 12, fontWeight: '700', marginLeft: 2 }}>Return</Text>
            </View>
        </Button>
    );
};

export function GoBackButton({ size = 26, iconColor = '#000' }) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Iconify
                icon={'ri:arrow-left-s-line'}
                size={size}
                style={{ marginRight: 2, color: iconColor }}
            />
        </TouchableOpacity>
    );
};