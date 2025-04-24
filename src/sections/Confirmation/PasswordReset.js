import React from 'react';
import { View, Linking, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
// @react-navigation
import { Link } from '@react-navigation/native';
// components
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function PasswordReset() {
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
        source={require('../../../assets/sortify-logo-email.png')}
        style={{
          width: 75,
          height: 102,
          marginBottom: 30,
        }}
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

      <Link screen="Login" style={{ fontSize: 13, color: palette.disabled.secondary, marginTop: 15 }}>
        Back to Login
      </Link>
    </View>
  );
}