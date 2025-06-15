import { View, Image, ActivityIndicator } from 'react-native';
// components
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function LoadingIndicator() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={110} color={palette.primary.main} style={{ position: 'absolute' }} />
                <Image
                    source={require('../../../assets/sortify-logo.png')}
                    style={{ width: 50, height: 50, resizeMode: 'contain' }}
                />
            </View>
        </View>
    );
}