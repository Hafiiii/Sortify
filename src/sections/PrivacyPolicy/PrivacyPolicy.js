import { ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// components
import { ReturnButton } from '../../components/GoBackButton/GoBackButton';

// ----------------------------------------------------------------------

export default function PrivacyPolicy() {
    return (
        <ScrollView contentContainerStyle={{ padding: 30 }} showsVerticalScrollIndicator={false}>
            <ReturnButton />

            <Text style={{ fontSize: 22, fontWeight: 700, marginBottom: 15 }}>Privacy Policy</Text>

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
            <Text style={{ fontWeight: 700, marginBottom: 5 }}>2.1 Data Collection</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                We collect personal information such as your name, email address, location, and usage data when you create an account or use our Services. We may also collect data from your device such as IP address, device type, operating system, and app usage statistics.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 5 }}>2.2 How We Use Your Data</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                Your data is used to provide and improve our Services, respond to inquiries, send updates, and enhance the waste sorting features through analytics and machine learning. We do not sell your data to third parties.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 5 }}>2.3 Data Security</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                We take reasonable measures to protect your information from unauthorized access, loss, misuse, or alteration. However, no method of transmission over the internet is completely secure.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 5 }}>2.4 Data Sharing</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                We may share your data with third-party service providers who help us operate the app, such as analytics services or cloud storage providers. These third parties are bound by confidentiality agreements.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 5 }}>2.5 Children's Privacy</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                We do not knowingly collect personal information from individuals under the age of 13. If we learn that we have collected such data, we will take steps to delete it promptly.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 5 }}>2.6 Changes to Privacy Policy</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                Sortify may update this Privacy Policy from time to time. You are encouraged to review this page periodically for any changes. Continued use of the App after changes constitutes your acceptance of the new terms.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 10 }}>3. CONTACT US</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                For any questions or concerns about this Privacy Policy or how your data is handled, please <TouchableOpacity onPress={() => navigation.navigate('ContactUs')} >
                    <Text style={{ textDecorationLine: 'underline', marginBottom: -8 }}>
                        CONTACT US
                    </Text>
                </TouchableOpacity>.
            </Text>

        </ScrollView>
    );
};