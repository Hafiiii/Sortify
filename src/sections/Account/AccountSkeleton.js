import { View, Image, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// sections
import AuthSocial from '../../auth/AuthSocial';
// components
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

export default function AccountSkeleton({
    title,
    children,
    footerLinkText,
    footerLinkAction,
    footerLinkLabel,
    bottomText1,
    bottomText2,
    bottomTextLink1,
    bottomTextLink2,
}) {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', width: width, height: height, justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "HomeStack", params: { screen: "Home" } })}>
                <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
                    <Text style={{ color: palette.primary.main, fontWeight: 700, letterSpacing: 2 }}>
                        SORTIFY
                    </Text>
                    <Image source={require("../../../assets/sortify-logo.webp")} style={{ width: 45, height: 60 }} />
                </View>
            </TouchableOpacity>

            <View style={{ backgroundColor: palette.primary.main, borderTopLeftRadius: 40, borderTopRightRadius: 40 }}>
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 700,
                        textAlign: 'center',
                        marginVertical: 10,
                    }}
                >
                    {title}
                </Text>

                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: '#000',
                        marginHorizontal: 15,
                        marginBottom: 15,
                        padding: 15,
                    }}
                >
                    {children}

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                        <Text>{footerLinkText} </Text>
                        <TouchableOpacity onPress={footerLinkAction}>
                            <Text style={{ fontWeight: 700, color: '#000', marginTop: -5 }}>
                                {footerLinkLabel}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                        <View style={{ height: 1, backgroundColor: palette.disabled.main, width: width * 0.32 }} />
                        <Text style={{ fontSize: 10, marginHorizontal: 10, color: palette.disabled.main }}>
                            OR
                        </Text>
                        <View style={{ height: 1, backgroundColor: palette.disabled.main, width: width * 0.32 }} />
                    </View>

                    <AuthSocial />

                    {!bottomText2 ? (
                        <Text style={{ fontSize: 12, color: palette.disabled.main, textAlign: 'center', marginTop: 5 }}>
                            {bottomText1} <TouchableOpacity onPress={() => { Linking.openURL('mailto:wastesorting50@gmail.com?') }}>
                                <Text style={{ marginBottom: -7, fontSize: 12, color: palette.disabled.main, textDecorationLine: 'underline' }}>
                                    {bottomTextLink1}
                                </Text>
                            </TouchableOpacity>
                        </Text>
                    ) : (

                        <Text style={{ fontSize: 10, color: palette.disabled.main, textAlign: 'center', marginTop: 5 }}>
                            {bottomText1} <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
                                <Text style={{ marginBottom: -6, fontSize: 10, color: palette.disabled.main, textDecorationLine: 'underline' }}>
                                    {bottomTextLink1}
                                </Text>
                            </TouchableOpacity> {bottomText2} <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                                <Text style={{ marginBottom: -6, fontSize: 10, color: palette.disabled.main, textDecorationLine: 'underline' }}>
                                    {bottomTextLink2}
                                </Text>
                            </TouchableOpacity>.
                        </Text>
                    )}
                </View>
            </View>
        </View >
    );
}
