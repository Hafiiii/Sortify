import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// hooks
import { getUsers } from '../hooks/getUsers';
// components
import { Header } from '../components/Header/Header';
import palette from '../theme/palette';
import Iconify from 'react-native-iconify';
import { BRONZE_POINT, SILVER_POINT, GOLD_POINT } from '../utils/helper';

// ----------------------------------------------------------------------

const activities = [
    {
        title: 'Recycling Value Calculator',
        image: require('../../assets/recycling-value.png'),
        desc: 'This feature estimates how much money users can earn by recycling based on the type and quantity of recyclable items.',
        iconName: 'Gold',
        requiredPoints: GOLD_POINT,
        route: 'RecyclingValue',
    },
    {
        title: 'Carbon Footprint Tracker',
        image: require('../../assets/carbon-footprint.jpeg'),
        desc: 'This feature helps users monitor their environmental impact by tracking their daily activities and carbon footprint.',
        iconName: 'Silver',
        requiredPoints: SILVER_POINT,
        route: 'Leaderboard',
    },
    {
        title: 'Leaderboard',
        image: require('../../assets/leaderboard.png'),
        desc: 'The leaderboard promotes a sense of community and friendly competition by showcasing top recyclers and tracking their rank.',
        iconName: 'Bronze',
        requiredPoints: BRONZE_POINT,
        route: 'Leaderboard',
    },
];

// ----------------------------------------------------------------------

export default function ActivitiesScreen() {
    const navigation = useNavigation();
    const { userData } = getUsers();

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 30 }} showsVerticalScrollIndicator={false}>
                <Header title="Activities" style={{ fontWeight: 700 }} />

                {activities.map((activity, index) => {
                    const isLocked = userData?.totalPoints < activity.requiredPoints;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => !isLocked && navigation.navigate(activity.route)}
                            activeOpacity={0.7}
                            disabled={isLocked}
                            style={{ marginVertical: 3 }}
                        >
                            <View style={{ position: 'relative' }}>
                                <ActivitiesBox
                                    image={activity.image}
                                    title={activity.title}
                                    iconName={activity.iconName}
                                    desc={activity.desc}
                                />

                                {isLocked && (
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 20, overflow: 'hidden' }}>
                                        <Image
                                            source={require('../../assets/activities-box-gradient.png')}
                                            style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 }}
                                        />
                                        <Iconify icon="mingcute:lock-fill" width={30} style={{ color: '#efefef', marginBottom: 10 }} />
                                        <Text
                                            style={{
                                                color: '#efefef',
                                                fontWeight: 'bold',
                                                fontSize: 16,
                                                textAlign: 'center',
                                                paddingHorizontal: 10,
                                            }}
                                        >
                                            Reach {activity.iconName} to unlock
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View >
    );
}

function ActivitiesBox({ image, title, iconName, desc, style = {} }) {
    return (
        <View
            style={{
                height: 190,
                borderRadius: 20,
                boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
                ...style
            }}
        >
            <Image
                source={image}
                style={{
                    width: '100%',
                    height: '45%',
                    resizeMode: 'cover',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
            />
            <View style={{ padding: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: 700 }}>{title}</Text>
                    <View
                        style={{
                            backgroundColor: palette.secondary.main,
                            padding: 2,
                            borderRadius: 20,
                            width: 60,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontWeight: 700, fontSize: 12 }}>{iconName}</Text>
                    </View>
                </View>
                <Text style={{ fontSize: 10, color: palette.disabled.secondary, textAlign: 'justify' }}>
                    {desc}
                </Text>
            </View>
        </View>
    );
}