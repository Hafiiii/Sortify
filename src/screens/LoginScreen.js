import { View, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { Link } from '@react-navigation/native';
// components
import AuthLogin from '../auth/AuthLogin';
import AuthSocial from '../auth/AuthSocial';
import palette from '../theme/palette';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('screen');

// ----------------------------------------------------------------------

export default function RegisterScreen() {
  return (
    <View
      style={{
        flex: 1,
        width: width,
        height: height,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ alignItems: 'center', marginVertical: 15 }}>
        <Text
          style={{
            color: palette.primary.main,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2.5
          }}
        >
          SORTIFY
        </Text>
        <Image
          source={require("../../assets/sortify-logo.png")}
          style={{ width: 75, height: 102 }}
        />
      </View>

      <View
        style={{
          backgroundColor: palette.primary.main,
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 27,
            fontWeight: 700,
            textAlign: 'center',
            marginVertical: 15,
          }}
        >
          Welcome
        </Text>

        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 23,
            borderWidth: 1,
            borderColor: '#000',
            marginHorizontal: 30,
            marginBottom: 20,
            paddingHorizontal: 25,
            paddingVertical: 30,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            Enter your email to continue
          </Text>

          <AuthLogin />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Text>Don't have an account? </Text>
            <Link
              screen="Register"
              style={{ fontWeight: 700, color: '#000', marginTop: -5 }}>
              Register
            </Link>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 10,
            }}
          >
            <View style={{ height: 1, backgroundColor: palette.disabled.main, width: width * 0.3 }} />
            <Text style={{ marginHorizontal: 10, color: palette.disabled.main }}>OR</Text>
            <View style={{ height: 1, backgroundColor: palette.disabled.main, width: width * 0.3 }} />
          </View>

          <AuthSocial />

        </View>
      </View>
    </View >
  );
}
