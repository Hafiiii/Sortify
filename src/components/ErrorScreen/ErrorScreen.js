import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// components
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

export default function ErrorScreen({ message = "Something went wrong.", onRetry }) {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
            }}
        >
            <Iconify
                icon="eva:alert-circle-outline"
                size={64}
                color="red"
                style={{ marginBottom: 20 }}
            />

            <Text style={{
                fontSize: 16,
                color: 'red',
                textAlign: 'center',
                marginBottom: 20,
            }}
            >
                {message}
            </Text>

            {onRetry && (
                <TouchableOpacity
                    onPress={onRetry}
                    style={{
                        backgroundColor: '#000',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retry</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}