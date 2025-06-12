import { ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// components
import { ReturnButton } from '../../components/GoBackButton/GoBackButton';

// ----------------------------------------------------------------------

export default function TermsOfService() {
    return (
        <ScrollView contentContainerStyle={{ padding: 30 }} showsVerticalScrollIndicator={false}>
            <ReturnButton />

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
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                2.1 We value your privacy. By using the Sortify App, you agree that Sortify may collect, use, and disclose your personal data as described in our Privacy Policy. We will handle your data responsibly and in accordance with all applicable privacy laws.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                2.2 Information collected may include personal information (e.g., name, email address), usage data, and image data uploaded by users for the purpose of waste identification. This data may be used to improve the App’s services, enhance user experience, and for analytics.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                2.3 You are responsible for keeping your account credentials secure. Sortify is not liable for any unauthorized access to your account resulting from your failure to safeguard your information.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 15 }}>3. USER CONDUCT</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                3.1 You agree to use the App only for lawful purposes and in a way that does not infringe on the rights of, restrict, or inhibit anyone else's use and enjoyment of the App.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                3.2 You may not misuse the App by knowingly introducing viruses, trojans, or other material that is malicious or technologically harmful. You must not attempt to gain unauthorized access to our Services or servers.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 15 }}>4. INTELLECTUAL PROPERTY</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                4.1 All content on Sortify, including but not limited to text, images, icons, logos, and software, is the property of Sortify or its licensors and is protected by intellectual property laws.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                4.2 You may not reproduce, distribute, modify, or create derivative works of any content without express written permission from Sortify.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 15 }}>5. TERMINATION</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                5.1 Sortify reserves the right to suspend or terminate your access to the App or Services at our sole discretion, without notice, for conduct that we believe violates these Terms, is harmful to other users, or is otherwise inappropriate.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 15 }}>6. DISCLAIMER AND LIMITATION OF LIABILITY</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                6.1 The App is provided on an "as-is" and "as-available" basis. We do not guarantee that the App will always be safe, secure, or error-free, or that it will function without disruptions, delays, or imperfections.
            </Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                6.2 To the fullest extent permitted by law, Sortify disclaims all warranties, express or implied, and shall not be liable for any damages arising from the use of or inability to use the App.
            </Text>

            <Text style={{ fontWeight: 700, marginBottom: 15 }}>7. CONTACT INFORMATION</Text>
            <Text style={{ marginBottom: 10, textAlign: 'justify' }}>
                If you have any questions about these Terms, please <TouchableOpacity onPress={() => navigation.navigate('ContactUs')} >
                    <Text style={{ textDecorationLine: 'underline', marginBottom: -8 }}>
                        CONTACT US
                    </Text>
                </TouchableOpacity>.
            </Text>

            <Text style={{ fontSize: 12, marginTop: 20, textAlign: 'center' }}>
                Last updated: June 12, 2025
            </Text>
        </ScrollView>
    );
};