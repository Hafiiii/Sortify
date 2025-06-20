import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Iconify } from 'react-native-iconify';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

const ecoTipsByDay = [
    [ // Sunday
        "Recycle your old newspapers and magazines.",
        "Use a clothesline instead of a dryer.",
        "Avoid fast fashion—buy secondhand or sustainable brands.",
        "Switch off appliances at the socket to save energy.",
        "Bring your own containers when ordering takeout."
    ],
    [ // Monday
        "Use both sides of paper before recycling.",
        "Compost your kitchen scraps.",
        "Bring a reusable coffee cup to your favorite café.",
        "Opt for digital receipts instead of printed ones.",
        "Replace paper towels with reusable cloths."
    ],
    [ // Tuesday
        "Refill water bottles instead of buying new ones.",
        "Fix leaky faucets to save water.",
        "Use a broom instead of a hose to clean driveways.",
        "Pack lunch in reusable containers.",
        "Turn off lights when leaving the room."
    ],
    [ // Wednesday
        "Unsubscribe from junk mail to reduce paper waste.",
        "Recycle batteries and electronics properly.",
        "Buy in bulk to cut down on packaging waste.",
        "Choose products with minimal or recyclable packaging.",
        "Carpool or use public transport when possible."
    ],
    [ // Thursday
        "Skip the straw or use a metal one.",
        "Use a bamboo toothbrush instead of plastic.",
        "Opt for bar soap over bottled body wash.",
        "Bring a reusable shopping bag everywhere.",
        "Choose local produce to reduce carbon footprint."
    ],
    [ // Friday
        "Donate old clothes instead of throwing them away.",
        "Take shorter showers to conserve water.",
        "Use a programmable thermostat to save energy.",
        "Buy refillable cleaning products.",
        "Reuse packaging materials when shipping items."
    ],
    [ // Saturday
        "Do a fridge clean-out to avoid food waste.",
        "Host a clothes swap with friends.",
        "Collect rainwater for gardening.",
        "Use eco-friendly laundry detergent.",
        "Buy rechargeable batteries instead of disposable ones."
    ],
];

// ----------------------------------------------------------------------

export default function EcoTips() {
    const today = new Date().getDay();
    const todayTips = ecoTipsByDay[today];

    return (
        <View style={{ paddingHorizontal: 30, paddingVertical: 10, paddingBottom: 74 }}>
            <Text style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Daily Eco Tips</Text>

            {todayTips.map((tip, index) => (
                <View
                    key={index}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 15,
                        marginBottom: 5,
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                        backgroundColor: palette.primary.light,
                        borderRadius: 10,
                    }}
                >
                    <Iconify icon="openmoji:deciduous-tree" size={24} style={{ color: palette.primary.dark }} />

                    <Text
                        style={{
                            flex: 1,
                            textAlign: 'justify',
                        }}
                    >
                        {tip}
                    </Text>
                </View>

            ))}
        </View>
    );
}
