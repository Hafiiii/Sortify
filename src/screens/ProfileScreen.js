import { View, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { Link } from '@react-navigation/native';
// components
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('screen');

// ----------------------------------------------------------------------

export default function ProfileScreen() {
    console.log();
    return (
        <View
            style={{
                flex: 1,
                width: width,
                height: height,
                justifyContent: 'space-between',
                backgroundColor: palette.primary.main,
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
            </View>

            <View
                style={{
                    backgroundColor: "#fff",
                    borderTopLeftRadius: 60,
                    borderTopRightRadius: 60,
                }}
            >
                <Text
                    style={{
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


                </View>
            </View>
        </View >
    );
};