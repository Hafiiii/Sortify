import { View, ScrollView, Text, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// components
import { ReturnButton } from '../../components/GoBackButton/GoBackButton';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

const instructions = [
    {
        text: "Match the correct waste type to the item displayed above.",
        image: require('../../../assets/instruction-1.jpg'),
    },
    {
        text: "Watch the green timer ring — it shows how much time you have.",
        image: require('../../../assets/instruction-2.jpg'),
    },
    {
        text: "Tap the item before the green ring disappears!",
    },
    {
        text: "Earn points for every correct match.",
        image: require('../../../assets/instruction-3.jpg'),
    },
    {
        text: "The game speeds up as your score increases.",
    },
    {
        text: "You can only make 3 mistakes — be careful!",
        image: require('../../../assets/instruction-4.jpg'),
    },
    {
        text: "If time runs out without the correct tap, it counts as a mistake.",
    },
];

// ----------------------------------------------------------------------

export default function Gamification() {
    const navigation = useNavigation();

    return (
        <ImageBackground
            source={require('../../../assets/game-instruction-bg.jpg')}
            style={{ flex: 1, padding: 10 }}
            resizeMode="cover"
        >
            <ReturnButton />

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text
                    style={{
                        fontSize: 30,
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: 20,
                        color: '#fff',
                        textShadowColor: '#000',
                        textShadowOffset: { width: -2.5, height: 2 },
                        textShadowRadius: 1,
                    }}
                >
                    KNOW YOUR TRASH
                </Text>

                <View
                    style={{
                        width: width * 0.9,
                        height: height * 0.7,
                        backgroundColor: '#fff',
                        borderRadius: 60,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderWidth: 2.5,
                        borderColor: '#000',
                        overflow: 'hidden',
                    }}
                >
                    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', marginVertical: 10, textAlign: 'center' }}>
                            How to Play?
                        </Text>

                        <View style={{ width: '100%', gap: 8 }}>
                            {instructions.map((item, index) => (
                                <View key={index}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                                        <Text>{index + 1}.</Text>
                                        <Text style={{ flex: 1, textAlign: 'justify' }}>{item.text}</Text>
                                    </View>
                                    {item.image && (
                                        <Image
                                            source={item.image}
                                            style={{ height: 70, resizeMode: 'contain', alignSelf: 'center', marginTop: 6 }}
                                        />
                                    )}
                                </View>
                            ))}
                        </View>

                        <Text style={{ fontWeight: 700, marginTop: 25, textAlign: 'center', fontSize: 16 }}>
                            Get the highest score! Prove you're trash-talented.
                        </Text>
                    </ScrollView>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Main', {
                                screen: 'ActivitiesStack',
                                params: { screen: 'Game' },
                            })
                        }
                        style={{
                            marginTop: 10,
                            backgroundColor: palette.primary.main,
                            paddingVertical: 14,
                            paddingHorizontal: 24,
                            borderRadius: 50,
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 700 }}>Start Game</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}