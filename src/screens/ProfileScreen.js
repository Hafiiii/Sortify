import { View, Text, Image, Dimensions, Alert } from 'react-native';
import { Button, ProgressBar } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
// hooks
import { getUsers } from '../hooks/getUsers';
// components
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { BRONZE_POINT, SILVER_POINT, GOLD_POINT, censorEmail, censorPhoneNumber } from '../utils/helper';
import ModalPoints from '../components/Points/ModalPoints';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

export default function ProfileScreen() {
    const navigation = useNavigation();
    const { userData, loading } = getUsers();
    const formattedDate = moment(userData?.dateJoined.toDate()).format('DD/MM/YY');

    const handleLogout = () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            navigation.navigate("Main", { screen: "HomeStack", params: { screen: "Home" } });
                        } catch (error) {
                            Toast.show({ type: 'error', text1: 'Error signing out.', text2: error.message || 'Please try again later.' });
                        }
                    }
                }
            ]
        );
    };

    const getTier = () => {
        if (!userData?.totalPoints) return 'Member';

        const points = userData.totalPoints;
        if (points >= BRONZE_POINT) return 'Bronze';
        if (points >= SILVER_POINT) return 'Silver';
        if (points >= GOLD_POINT) return 'Gold';
        return 'Member';
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Button onPress={() => { navigation.navigate("ProfileStack", { screen: "Statistics" }) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Iconify icon={'akar-icons:statistic-up'} size={16} style={{ color: '#fff' }} />
                            <Text style={{ color: '#fff' }}>Statistics</Text>
                        </View>
                    </Button>

                    <Button onPress={() => { navigation.navigate('Settings') }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Iconify icon={'uil:setting'} size={16} style={{ color: '#fff' }} />
                            <Text style={{ color: '#fff' }}>Settings</Text>
                        </View>
                    </Button>
                </View>

                <Button onPress={handleLogout}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Iconify icon={'material-symbols:logout'} size={16} style={{ color: '#fff' }} />
                        <Text style={{ color: '#fff' }}>Logout</Text>
                    </View>
                </Button>
            </View>

            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 60, borderTopRightRadius: 60, alignItems: 'center' }}>
                <Image
                    source={userData?.photoURL ? { uri: userData.photoURL } : require("../../assets/profile.jpeg")}
                    style={{ width: 90, height: 90, borderRadius: 50, marginTop: -50 }}
                />

                <Text style={{ fontSize: 16, fontWeight: 700, marginTop: 7 }}>{userData?.firstName} {userData?.lastName}</Text>
                <Text style={{ fontSize: 11, color: palette.disabled.main, marginBottom: 10 }}>Joined {formattedDate}</Text>

                <View
                    style={{
                        width: width - 70,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 2,
                        backgroundColor: '#f5f5f5',
                        padding: 15,
                        borderRadius: 15,
                        marginBottom: 8,
                        marginTop: 15,
                        boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Iconify icon={'emojione:sports-medal'} size={12} />
                            <Text style={{ fontWeight: 700 }}>{getTier()}</Text>
                        </View>

                        <ModalPoints data={userData?.totalPoints || 0} style={{ paddingVertical: 2, paddingHorizontal: 7 }} />

                    </View>

                    <Text style={{ color: palette.disabled.secondary, fontSize: 12 }}>
                        Enjoy exclusive<Text> {getTier().toLowerCase()} </Text>benefits
                    </Text>
                </View>

                <View
                    style={{
                        width: width - 70,
                        backgroundColor: '#f5f5f5',
                        padding: 15,
                        borderRadius: 15,
                        marginBottom: 90,
                        boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    <ProfileList title="First Name" children={userData?.firstName} />
                    <ProfileList title="Last Name" children={userData?.lastName} />
                    <ProfileList title="Gender" children={userData?.gender} />
                    <ProfileList title="Email" children={censorEmail(userData?.email)} />
                    <ProfileList title="Phone Number" children={censorPhoneNumber(userData?.phoneNumber)} />
                    <ProfileList title="Date of Birth" children={formatDateString(userData?.birthday)} />

                    <Button
                        mode="contained"
                        onPress={() => { navigation.navigate('EditProfile') }}
                        loading={loading}
                        disabled={loading}
                        style={{ backgroundColor: '#000', borderRadius: 8, marginTop: 10 }}
                        labelStyle={{ color: '#fff' }}
                    >
                        Edit Profile
                    </Button>
                </View>
            </View>
        </View>
    );
}

function ProfileList({ title, children }) {
    return (
        <View style={{ gap: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
            <Text style={{ color: palette.disabled.main, fontSize: 11, width: '30%' }}>
                {title}
            </Text>
            <Text style={{ fontSize: 12, width: '65%', textAlign: 'right' }}>
                {children || '-'}
            </Text>
        </View>
    );
}