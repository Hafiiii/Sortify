import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { Link, useNavigation } from '@react-navigation/native';
// components
import AuthRegister from '../auth/AuthRegister';
import AuthSocial from '../auth/AuthSocial';
import palette from '../theme/palette';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('screen');

// ----------------------------------------------------------------------

export default function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        width: width,
        height: height,
        justifyContent: 'space-between',
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "Home" })}>
        <View style={{ alignItems: 'center', marginVertical: 30 }}>
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
      </TouchableOpacity>

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
          Getting Started
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
            paddingVertical: 20,
          }}
        >
          <AuthRegister />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Text>Already have an account? </Text>
            <Link
              screen="Login"
              style={{ fontWeight: 700, color: '#000', marginTop: -5 }}>
              Login
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

          <Text style={{ fontSize: 10, color: palette.disabled.main, textAlign: 'center', marginTop: 5 }}>
            By proceeding to sign up, I acknowledge that I have read and consented to
            Sortify's <Link screen="TermsOfService" style={{ color: palette.disabled.main, textDecorationLine: 'underline' }}>Terms of Service</Link> and <Link screen="PrivacyPolicy" style={{ color: palette.disabled.main, textDecorationLine: 'underline' }}>Privacy Policy</Link>.
          </Text>

        </View>
      </View>
    </View >
  );
}
