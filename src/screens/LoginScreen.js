import { Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// sections
import AccountSkeleton from '../sections/Account/AccountSkeleton';
import AuthLogin from '../auth/AuthLogin';

// ----------------------------------------------------------------------

export default function LoginScreen() {
  const navigation = useNavigation();

  return (
    <AccountSkeleton
      title="Welcome"
      footerLinkText="Don't have an account?"
      footerLinkAction={() => navigation.navigate("Register")}
      footerLinkLabel="Register"
      bottomText1="Any issues?"
      bottomTextLink1="CONTACT US"
    >
      <Text style={{ fontSize: 16, fontWeight: 700, textAlign: 'center', marginBottom: 15 }}>
        Enter your email to continue
      </Text>

      <AuthLogin />
    </AccountSkeleton>
  );
}
