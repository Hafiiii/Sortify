import { ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
// components
import GoBackButton from '../../components/GoBackButton/GoBackButton';

// ----------------------------------------------------------------------

export default function TermsOfService() {
    return (
        <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
            <GoBackButton />

            <Text style={{ fontSize: 22, fontWeight: 700, marginBottom: 15 }}>Terms of Service</Text>

            <Text style={{ fontWeight: 700, marginBottom: 15 }}>1. INTRODUCTION</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                1.1 Welcome to the Sortify platform (the "App"). Please read the following Terms of Service carefully before using this App or opening a Sortify account ("Account") so that you are aware of your legal rights and obligations with respect to Sortify Mobile App. These Terms of Service ("Terms") govern your use of our mobile application, website, and related services (collectively, the "Services") provided by Sortify ("we," "us," or "our"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                1.2 At Sortify, the services include utilizing of advanced image recognition technology to assist users in identifying and sorting various types of waste materials.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                1.3 Before becoming a User of the Platform, you must read and accept all of the terms in, and linked to, these Terms of Use and Sortify’s Privacy Policy. By accepting these Terms of Use, you agree that these Terms of Use will apply whenever you use the Platform or Services, or when you use the tools we make available to interact with the Platform or Services. If you do not agree to these Terms of Use, you may not use the Platform or Services.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                1.4 If you are under the age of 18 or the legal age for giving consent hereunder pursuant to the applicable laws in your country (the “legal age”), you must obtain permission from your parent(s) or legal guardian(s) to open an account on the Platform. If you are the parent or legal guardian of a minor who is creating an account, you must accept and comply with these Terms of Use on the minor's behalf and you will be responsible for the minor’s actions, any charges associated with the minor’s use of the Platform and/or Services or purchases made on the Platform. If you do not have consent from your parent(s) or legal guardian(s), you must stop using/accessing this Platform and/or Services.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                1.5 Sortify reserves the right to modify these Terms of Use at any time without giving you prior notice. Your use of the Platform following any such modification constitutes your agreement to follow and be bound by these Terms of Use as modified. The last date these Terms of Use were revised is set forth below.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 15 }}>2. PRIVACY</Text>
            
        </ScrollView>
    );
};