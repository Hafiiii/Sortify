import { useState, useEffect } from 'react';
import { View, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// firebase
import { firestore } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
// auth
import { useAuth } from '../context/AuthContext';
// sections
import WasteType from '../sections/Home/WasteType';
import GarbageTruck from '../components/Animation/GarbageTruck';
// components
import { Header } from '../components/Header/Header';
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';
import Toast from 'react-native-toast-message';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('screen');

// ----------------------------------------------------------------------

export default function HomeScreen() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
        } else {
          Toast.show({
            type: 'error',
            text1: 'User data not found in Firestore',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error fetching user data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
    >
      <View
        style={{
          borderBottomLeftRadius: 60,
          borderBottomRightRadius: 60,
          backgroundColor: palette.primary.main,
          padding: user ? 30 : 0,
          height: user ? height * 0.55 : height * 0.47,
          marginBottom: 70,
        }}
      >
        <Header title="Home" style={{ color: '#fff', padding: user ? 0 : 30, paddingBottom: 0 }} />

        {user ? (
          <>
            <View
              style={{
                backgroundColor: palette.secondary.main,
                padding: 4,
                borderRadius: 20,
                width: 70,
                alignItems: 'center',
                marginVertical: 10
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                {userData?.totalPoints <= 30 && <Text style={{ fontWeight: 700 }}>Bronze</Text>}
                {userData?.totalPoints > 30 && userData?.totalPoints <= 100 && <Text style={{ fontWeight: 700 }}>Silver</Text>}
                {userData?.totalPoints > 100 && <Text style={{ fontWeight: 700 }}>Gold</Text>}
              </TouchableOpacity>
            </View>

            <Text style={{ color: '#fff', fontSize: 30, fontWeight: 700 }}>Hello {userData?.firstName}!</Text>
            <Text style={{ color: '#fff', fontSize: 30, fontWeight: 700 }}>Ready to Sort?</Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: palette.secondary.main,
                paddingVertical: 20,
                paddingHorizontal: 45,
                borderRadius: 20,
                marginTop: 20
              }}
            >
              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Iconify icon="pepicons-pencil:coins-circle-filled" size={38} color="#000" />
                <Text style={{ fontSize: 20, fontWeight: 700, marginTop: 5 }}>{userData?.totalPoints || 0}</Text>
                <Text style={{ fontSize: 10, marginTop: 5 }}>POINTS</Text>
              </View>

              <View style={{ backgroundColor: '#000', width: 2, height: 70 }}></View>

              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Iconify icon="tdesign:cloud-filled" size={38} color="#000" />
                <Text style={{ fontSize: 20, fontWeight: 700, marginTop: 5 }}>{userData?.savedCO || 0}g</Text>
                <Text style={{ fontSize: 10, marginTop: 5 }}>SAVED CO2</Text>
              </View>

              <View style={{ backgroundColor: '#000', width: 2, height: 70 }}></View>

              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Iconify icon="mingcute:wastebasket-fill" size={38} color="#000" />
                <Text style={{ fontSize: 20, fontWeight: 700, marginTop: 5 }}>{userData?.totalWaste || 0}</Text>
                <Text style={{ fontSize: 10, marginTop: 5 }}>SORTED</Text>
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
                bottom: -80
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('Scan')}
                style={{ backgroundColor: '#000', padding: 20, borderRadius: 50, marginTop: 50 }}
              >
                <Iconify icon="ph:scan-bold" size={26} color="#fff" />
              </TouchableOpacity>

              <Image
                source={require('../../assets/bin.png')}
                style={{ width: 220, height: 220 }}
              />

            </View>
          </>
        ) : (
          <>
            <Text style={{ color: '#fff', fontSize: 36, fontWeight: 700, paddingHorizontal: user ? 0 : 30, }}>Hello! Ready to Sort?</Text>
            <GarbageTruck />
          </>
        )}

      </View>

      <WasteType />
    </ScrollView >
  );
}
