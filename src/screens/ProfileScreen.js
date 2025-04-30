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
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { BRONZE_POINT, SILVER_POINT, GOLD_POINT, TOTAL_RANGE } from '../utils/pointsConfig';

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
    if (str.length < 2) return str;
    return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
};

const censorPhoneNumber = (phone) => {
    if (!phone || phone.length < 4) return '';
    return `****${phone.slice(-4)}`;
};

// ----------------------------------------------------------------------

export default function ProfileScreen() {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const formattedDate = moment(userData?.dateJoined.toDate()).format('DD/MM/YY');

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
                Toast.show({
                    type: 'error',
                    text1: 'Error fetching user data.',
                });
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
            Toast.show({
                type: 'error',
                text1: 'Error signing out.',
            });
        }
    };

    const getTier = () => {
        if (!userData?.totalPoints) return 'Member';

        const points = userData.totalPoints;

        if (points >= BRONZE_POINT) return 'Bronze';
        if (points >= SILVER_POINT) return 'Silver';
        if (points >= GOLD_POINT) return 'Gold';
        return 'Member';
    };

    const getProgress = () => {
        if (!userData?.totalPoints) return 0;

        const points = userData.totalPoints;

        if (points <= BRONZE_POINT) {
            return points;
        } else if (points <= SILVER_POINT) {
            return (points - BRONZE_POINT) / (GOLD_POINT - BRONZE_POINT);
        } else if (points <= GOLD_POINT) {
            return (points - SILVER_POINT) / (GOLD_POINT - SILVER_POINT);
        } else {
            return 1;
        }
    };


    const formatDateString = (dateString) => {
        if (!dateString) return "-";
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
                    <Button onPress={() => { navigation.navigate("HistoryStack", { screen: "Statistics" }) }}>
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
                    Joined {formattedDate}
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Iconify
                                icon={'emojione:sports-medal'}
                                size={17}
                                style={{ marginRight: 5 }}
                            />
                            <Text style={{ fontSize: 19, fontWeight: 700 }}>{getTier()}</Text>
                        </View>

                        <View
                            style={{
                                backgroundColor: '#e5e5e5',
                                paddingVertical: 4,
                                paddingHorizontal: 7,
                                borderRadius: 20,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Iconify icon="twemoji:coin" color={palette.primary.main} size={12} />
                            <Text style={{ fontWeight: 700, fontSize: 11, marginLeft: 6 }}>{userData?.totalPoints}</Text>
                        </View>
                    </View>

                    <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                        Enjoy exclusive<Text> {getTier().toLowerCase()} </Text>benefits
                    </Text>

                    <View
                        style={{
                            position: 'relative',
                            width: width - 120,
                            marginTop: 10,
                            marginBottom: 40,
                            alignItems: 'center',
                        }}
                    >
                        <ProgressBar
                            progress={getProgress()}
                            color={palette.secondary.main}
                            style={{ height: 4, width: width - 160 }}
                        />

                        <View
                            style={{
                                position: 'absolute',
                                top: -3,
                                left: 0,
                                width: '95%',
                                height: 40,
                            }}
                        >
                            <View style={{
                                position: 'absolute',
                                left: `${(BRONZE_POINT / TOTAL_RANGE) * 100}%`,
                                alignItems: 'center',
                                transform: [{ translateX: -25 }],
                            }}>
                                <View style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: (userData?.totalPoints || 0) >= BRONZE_POINT
                                        ? palette.secondary.main
                                        : 'rgb(231, 224, 236)',
                                }} />
                                <Text style={{ fontSize: 10, marginTop: 6, color: palette.disabled.main }}>{Math.min(userData?.totalPoints || 0, BRONZE_POINT)}/{BRONZE_POINT}</Text>
                                <Text style={{ fontSize: 11, color: palette.disabled.secondary }}>Bronze</Text>
                            </View>

                            <View style={{
                                position: 'absolute',
                                left: `${(SILVER_POINT / TOTAL_RANGE) * 100}%`,
                                alignItems: 'center',
                                transform: [{ translateX: -25 }],
                            }}>
                                <View style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: (userData?.totalPoints || 0) >= SILVER_POINT
                                        ? palette.secondary.main
                                        : 'rgb(231, 224, 236)',
                                }} />
                                <Text style={{ fontSize: 10, marginTop: 6, color: palette.disabled.main }}>{Math.min(userData?.totalPoints || 0, SILVER_POINT)}/{SILVER_POINT}</Text>
                                <Text style={{ fontSize: 11, color: palette.disabled.secondary }}>Silver</Text>
                            </View>

                            <View style={{
                                position: 'absolute',
                                left: '100%',
                                alignItems: 'center',
                                transform: [{ translateX: -25 }],
                            }}>
                                <View style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: (userData?.totalPoints || 0) >= GOLD_POINT
                                        ? palette.secondary.main
                                        : 'rgb(231, 224, 236)',
                                }} />
                                <Text style={{ fontSize: 10, marginTop: 6, color: palette.disabled.main }}>{Math.min(userData?.totalPoints || 0, GOLD_POINT)}/{GOLD_POINT}</Text>
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
                        marginBottom: 90,
                        boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            First Name
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 700 }}>
                            {userData?.firstName || '-'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            Last Name
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 700 }}>
                            {userData?.lastName || '-'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            Gender
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 700 }}>
                            {userData?.gender || '-'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            Email
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 700 }}>
                            {censorEmail(userData?.email) || '-'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            Phone Number
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 700 }}>
                            {censorPhoneNumber(userData?.phoneNumber) || '-'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                            Date of Birth
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: "700" }}>
                            {formatDateString(userData?.birthday) || '-'}
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={() => { navigation.navigate('EditProfile') }}
                        loading={loading}
                        disabled={loading}
                        style={{ backgroundColor: '#000', borderRadius: 7, marginVertical: 10 }}
                        labelStyle={{ color: '#fff' }}
                    >
                        Edit Profile
                    </Button>
                </View>
            </View>
        </View>
    );
}
