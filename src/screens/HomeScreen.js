import { View, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// auth
import { useAuth } from '../context/AuthContext';
// hooks
import { getUsers } from '../hooks/getUsers';
import { getCategories } from '../hooks/getCategories';
// sections
import WasteType from '../sections/Home/WasteType';
import EcoTips from '../sections/Home/EcoTips';
import WasteCategoryCarousel from '../components/Animation/WasteCategoryCarousel';
// components
import { Header } from '../components/Header/Header';
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';
import { BRONZE_POINT, SILVER_POINT, GOLD_POINT } from '../utils/helper';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

export default function HomeScreen() {
  const { user } = useAuth();
  const { userData } = getUsers();
  const { categories } = getCategories();
  const navigation = useNavigation();

  const getDaysSinceJoined = (dateJoined) => {
    if (!dateJoined?.seconds) return 0;

    const joinedDate = new Date(dateJoined.seconds * 1000);
    if (isNaN(joinedDate)) return 0;

    const today = new Date();

    // Zero out time components
    joinedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today - joinedDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };



  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          borderBottomLeftRadius: 60,
          borderBottomRightRadius: 60,
          backgroundColor: palette.primary.main,
          padding: user ? 30 : 0,
          paddingTop: user ? 20 : 0,
          height: user ? height * 0.50 : height * 0.45,
          marginBottom: 44,
        }}
      >
        <Header title="Home" style={{ color: '#fff', padding: user ? 0 : 30, paddingBottom: 0 }} />

        {user ? (
          <>
            <View
              style={{
                backgroundColor: userData?.totalPoints < BRONZE_POINT ? '#f5f5f5' : palette.secondary.main,
                padding: 3,
                borderRadius: 20,
                width: 58,
                alignItems: 'center',
                marginVertical: 5
              }}
            >
              <TouchableOpacity onPress={() => { navigation.navigate("Main", { screen: "ProfileStack", params: { screen: "Profile" } }) }}>
                {userData?.totalPoints < BRONZE_POINT && <Text style={{ fontSize: 12, fontWeight: 700, color: palette.disabled.secondary }}>Member</Text>}
                {userData?.totalPoints >= BRONZE_POINT && userData?.totalPoints < SILVER_POINT && <Text style={{ fontSize: 12, fontWeight: 700 }}>Bronze</Text>}
                {userData?.totalPoints >= SILVER_POINT && userData?.totalPoints < GOLD_POINT && <Text style={{ fontSize: 12, fontWeight: 700 }}>Silver</Text>}
                {userData?.totalPoints >= GOLD_POINT && <Text style={{ fontSize: 12, fontWeight: 700 }}>Gold</Text>}
              </TouchableOpacity>
            </View>

            <Text style={{ color: '#fff', fontSize: 26, fontWeight: 700 }}>Hello {userData?.firstName}!</Text>
            <Text style={{ color: '#fff', fontSize: 26, fontWeight: 700 }}>Ready to Sort?</Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: palette.secondary.main,
                paddingVertical: 13,
                paddingHorizontal: 34,
                borderRadius: 20,
                marginTop: 10,
              }}
            >
              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Iconify icon="pepicons-pencil:coins-circle-filled" size={28} color="#000" />
                <Text style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>{userData?.totalPoints || 0}</Text>
                <Text style={{ fontSize: 10 }}>POINTS</Text>
              </View>

              <View style={{ backgroundColor: '#000', width: 2, height: 70 }}></View>

              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Iconify icon="uis:calendar" size={28} color="#000" />
                <Text style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>
                  {getDaysSinceJoined(userData?.dateJoined)}
                </Text>
                <Text style={{ fontSize: 10 }}>DAYS JOINED</Text>
              </View>


              <View style={{ backgroundColor: '#000', width: 2, height: 70 }}></View>

              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Iconify icon="mingcute:wastebasket-fill" size={28} color="#000" />
                <Text style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>{userData?.totalPoints || 0}</Text>
                <Text style={{ fontSize: 10 }}>SORTED</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'absolute',
                right: -15,
                left: 35,
                bottom: -75,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('Scan')}
                style={{ backgroundColor: '#000', padding: 18, borderRadius: 50, marginTop: 40 }}
              >
                <Iconify icon="ph:scan-bold" size={28} color="#fff" />
              </TouchableOpacity>

              <Image source={require('../../assets/bin.png')} style={{ width: 190, height: 190 }} />
            </View>
          </>
        ) : (
          <>
            <Text style={{ color: '#fff', fontSize: 34, fontWeight: 700, paddingHorizontal: 30, }}>Hello! Ready to Sort?</Text>

            <WasteCategoryCarousel />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'absolute',
                right: -15,
                left: 35,
                bottom: -75,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('Scan')}
                style={{ backgroundColor: '#000', padding: 18, borderRadius: 50, marginTop: 40 }}
              >
                <Iconify icon="ph:scan-bold" size={28} color="#fff" />
              </TouchableOpacity>

              <Image source={require('../../assets/bin.png')} style={{ width: 190, height: 190 }} />
            </View>
          </>
        )}
      </View>

      <WasteType categories={categories} />

      <EcoTips />
    </ScrollView >
  );
}
