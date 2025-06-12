// @react-navigation
import { useNavigation } from '@react-navigation/native';
// sections
import AccountSkeleton from '../sections/Account/AccountSkeleton';
import AuthRegister from '../auth/AuthRegister';

// ----------------------------------------------------------------------

export default function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <AccountSkeleton
      title="Getting Started"
      footerLinkText="Already have an account?"
      footerLinkAction={() => navigation.navigate("Login")}
      footerLinkLabel="Login"
      bottomText1="By proceeding to sign up, I acknowledge that I have read and consented to Sortify's"
      bottomTextLink1="Terms of Service"
      bottomText2="and"
      bottomTextLink2="Privacy Policy"
    >
      <AuthRegister />
    </AccountSkeleton>
  );
}