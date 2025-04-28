import { View, Image, ScrollView, SafeAreaView } from 'react-native';
import { Text, Card } from 'react-native-paper';
// components
import { Header } from '../components/Header/Header';
import { Iconify } from 'react-native-iconify';
import palette from '../theme/palette';

// ----------------------------------------------------------------------

export default function ActivitiesScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 30 }} showsVerticalScrollIndicator={false}>
                <Header title="Activities" style={{ fontWeight: 700 }} />

                <ActivitiesBox
                    image={require("../../assets/recycling-value.png")}
                    title="Recycling Value Calculator"
                    iconName="Gold"
                    desc="This feature estimates how much money users can earn by recycling based on the type and quantity of recyclable items."
                />

                <ActivitiesBox
                    image={require("../../assets/leaderboard.png")}
                    title="Leaderboard"
                    iconName="Silver"
                    desc="The leaderboard promotes a sense of community and friendly competition by showcasing top recyclers and can track their ranking based on recycling efforts."
                />

                <ActivitiesBox
                    image={require("../../assets/carbon-footprint.jpeg")}
                    title="Carbon Footprint Tracker"
                    iconName="Bronze"
                    desc="This feature helps users monitor their environmental impact by tracking their daily activities and provides a visual summary of their carbon footprint."
                />

            </ScrollView>
        </SafeAreaView>
    );
}

function ActivitiesBox({ image, title, iconName, desc }) {
    return (
        <View
            style={{
                height: 190,
                borderRadius: 20,
                marginVertical: 10,
                boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)'
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