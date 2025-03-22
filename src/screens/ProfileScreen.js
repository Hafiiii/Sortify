import { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { Button, ProgressBar } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { auth, firestore } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
// auth
import { useAuth } from '../context/AuthContext';
// components
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('screen');

const censorEmail = (curr_email) => {
    if (curr_email && curr_email.length > 5) {
        const arr = curr_email.split("@");
        return `${censorWord(arr[0])}@${arr[1]}`;
    }
    return "No email was found";
};

const censorWord = (str) => {
    if (str.length < 2) return str; // Edge case: Avoid breaking short words
    return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
};

const censorPhoneNumber = (phone) => {
    if (!phone || phone.length < 4) return ''; // Edge case: Avoid errors with short numbers
    return `****${phone.slice(-4)}`;
};


// ----------------------------------------------------------------------

export default function ProfileScreen() {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.uid) {
                console.log('No authenticated user found.');
                setLoading(false);
                return;
            }

            try {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userSnapshot = await getDoc(userDocRef);

                if (userSnapshot.exists()) {
                    setUserData(userSnapshot.data());
                } else {
                    console.log('User data not found in Firestore');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleLogout = async () => {
        try {
            signOut(auth);
            navigation.replace('Login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const tierLevel = 2; // 1 = Bronze, 2 = Silver, 3 = Gold

    const getProgress = () => {
        switch (tierLevel) {
            case 1: return 0.33; // Bronze
            case 2: return 0.66; // Silver
            case 3: return 1;    // Gold
            default: return 0;
        }
    };

    const formatDateString = (dateString) => {
        if (!dateString) return "Billie";
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };

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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 15 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Button onPress={() => { navigation.navigate('Statistics') }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Iconify
                                icon={'akar-icons:statistic-up'}
                                size={16}
                                style={{ marginRight: 5, color: '#fff' }}
                            />
                            <Text style={{ color: '#fff' }}>Statistics</Text>
                        </View>
                    </Button>

                    <Button onPress={() => { navigation.navigate('Settings') }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Iconify
                                icon={'uil:setting'}
                                size={16}
                                style={{ marginRight: 5, color: '#fff' }}
                            />
                            <Text style={{ color: '#fff' }}>Settings</Text>
                        </View>
                    </Button>
                </View>

                <Button onPress={handleLogout}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Iconify
                            icon={'material-symbols:logout'}
                            size={16}
                            style={{ marginRight: 5, color: '#fff' }}
                        />
                        <Text style={{ color: '#fff' }}>Logout</Text>
                    </View>
                </Button>
            </View>

            <View
                style={{
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 60,
                    borderTopRightRadius: 60,
                    alignItems: 'center',
                }}
            >
                <Image
                    source={userData?.photoURL ? { uri: userData.photoURL } : require("../../assets/profile.jpeg")}
                    style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 6, marginTop: -50 }}
                />

                <Text style={{ fontSize: 20, fontWeight: 700 }}>{userData?.firstName} {userData?.lastName}</Text>
                <Text style={{ fontSize: 12, color: palette.disabled.main }}>
                    Joined {userData?.dateJoined?.toDate().toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                    })}
                </Text>

                <View
                    style={{
                        width: width - 85,
                        backgroundColor: '#f5f5f5',
                        padding: 16,
                        borderRadius: 20,
                        marginVertical: 20,
                        boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 700 }}>Gold</Text>
                        <Iconify
                            icon={'emojione:sports-medal'}
                            size={18}
                            style={{ marginLeft: 5 }}
                        />
                    </View>

                    <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                        Enjoy exclusive<Text> silver </Text>benefits
                    </Text>

                    <View
                        style={{
                            position: 'relative',
                            width: width - 120,
                            marginTop: 10,
                            marginBottom: 40,
                            alignItems: 'center'
                        }}
                    >
                        <ProgressBar
                            progress={getProgress()}
                            color={palette.secondary.main}
                            style={{ height: 4, width: width - 160 }}
                        />

                        <View style={{
                            position: 'absolute',
                            top: -3,
                            left: 0,
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View style={{ alignItems: 'center', width: 50 }}>
                                <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: palette.secondary.main,
                                    }}
                                />
                                <Text style={{ fontSize: 10, marginTop: 6, color: palette.disabled.main }}>30/30</Text>
                                <Text style={{ fontSize: 11, color: palette.disabled.secondary }}>Bronze</Text>
                            </View>

                            <View style={{ alignItems: 'center', width: 50 }}>
                                <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: palette.secondary.main,
                                    }}
                                />
                                <Text style={{ fontSize: 10, marginTop: 6, color: palette.disabled.main }}>100/100</Text>
                                <Text style={{ fontSize: 11, color: palette.disabled.secondary }}>Silver</Text>
                            </View>

                            <View style={{ alignItems: 'center', width: 50 }}>
                                <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: palette.secondary.main,
                                    }}
                                />
                                <Text style={{ fontSize: 10, marginTop: 6, color: palette.disabled.main }}>300/300</Text>
                                <Text style={{ fontSize: 11, color: palette.disabled.secondary }}>Gold</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        width: width - 85,
                        backgroundColor: '#f5f5f5',
                        padding: 16,
                        borderRadius: 20,
                        marginBottom: 80,
                        boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            First Name
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 700 }}>
                            {userData?.firstName || 'Billie'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            Last Name
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 700 }}>
                            {userData?.lastName || 'Billie'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            Gender
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 700 }}>
                            {userData?.gender || 'Billie'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            Email
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 700 }}>
                            {censorEmail(userData?.email) || 'Billie'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            Phone Number
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 700 }}>
                            {censorPhoneNumber(userData?.phoneNumber) || 'Billie'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            Date of Birth
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: "700" }}>
                            {formatDateString(userData?.birthday)}
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={() => { navigation.navigate('EditProfile') }}
                        loading={loading}
                        disabled={loading}
                        style={{ backgroundColor: '#000', borderRadius: 7, marginVertical: 10 }}
                    >
                        Edit Profile
                    </Button>
                </View>
            </View>
        </View>
    );
}
