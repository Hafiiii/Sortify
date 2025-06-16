import { View, Linking, Image, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
// components
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function VerificationSkeleton() {
  const openEmailApp = () => {
    Linking.openURL('mailto:');
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
      }}
    >
      <Image
        source={require('../../../assets/sortify-logo-email.webp')}
        style={{ width: 75, height: 102, marginBottom: 30 }}
        resizeMode="contain"
      />

      <Text style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Check your email</Text>

      <Text style={{ textAlign: 'center', marginBottom: 30, color: palette.disabled.secondary }}>
        We've sent a password reset link to your email address. Tap the link to set a new password.
      </Text>

      <Button
        mode="contained"
        onPress={openEmailApp}
        style={{ backgroundColor: '#000' }}
      >
        Open Email App
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ fontSize: 13, color: palette.disabled.secondary, marginTop: 15 }}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}