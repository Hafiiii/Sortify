import { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import palette from '../../theme/palette';
import { Iconify } from 'react-native-iconify';

// ----------------------------------------------------------------------

const plasticTypes = [
    {
        codeIcon: '♳',
        codeNo: '1',
        name: 'PET (Polyethylene Terephthalate)',
        description: 'Bottled drinks, food containers.',
        facts: 'Light. Recyclable.',
        handling: 'Rinse and recycle. Avoid reuse for food.'
    },
    {
        codeIcon: '♴',
        codeNo: '2',
        name: 'HDPE (High-Density Polyethylene)',
        description: 'Milk jugs, shampoo bottles.',
        facts: 'One of the safest plastics.',
        handling: 'Clean before recycling. Reusable.'
    },
    {
        codeIcon: '♵',
        codeNo: '3',
        name: 'PVC (Polyvinyl Chloride)',
        description: 'Pipes, toys, cling wraps.',
        facts: 'Release toxic fumes when burned. Rarely recyclable.',
        handling: 'Never burn. Dispose at special facilities.'
    },
    {
        codeIcon: '♶',
        codeNo: '4',
        name: 'LDPE (Low-Density Polyethylene)',
        description: 'Plastic bags, wraps.',
        facts: 'Flexible. Sometimes recyclable.',
        handling: 'Reuse. Check local recycling rules.'
    },
    {
        codeIcon: '♷',
        codeNo: '5',
        name: 'PP (Polypropylene)',
        description: 'Yogurt cups, caps, straws.',
        facts: 'Heat resistant. Recyclable.',
        handling: 'Rinse and recycle.'
    },
    {
        codeIcon: '♸',
        codeNo: '6',
        name: 'PS (Polystyrene)',
        description: 'Foam cups, trays.',
        facts: 'Breaks into microplastics. Rarely accepted in recycling.',
        handling: 'Avoid. Use eco-friendly alternatives.'
    },
    {
        codeIcon: '♹',
        codeNo: '7',
        name: 'Other (Mixed/Unknown Plastics)',
        description: 'Electronics, baby bottles.',
        facts: 'Often non recyclable.',
        handling: 'Check label. Avoid BPA.'
    }
];

// ----------------------------------------------------------------------

export default function PlasticInfo() {
    const [showAll, setShowAll] = useState(false);

    const toggleShow = () => {
        setShowAll(prev => !prev);
    };

    const cardsToShow = showAll ? plasticTypes : plasticTypes.slice(0, 1);

    return (
        <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 10 }}>Types of Plastic</Text>

            {cardsToShow.map((item, index) => (
                <View
                    key={index}
                    style={{
                        backgroundColor: palette.secondary.light,
                        paddingHorizontal: 15,
                        paddingVertical: 7,
                        borderRadius: 12,
                        marginBottom: 7,
                        elevation: 2,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', marginTop: -3 }}>{item.codeIcon}</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700' }}>{item.codeNo}</Text>
                    </View>

                    <Text style={{ fontSize: 15, fontWeight: '700', textDecorationLine: 'underline', marginBottom: 3 }}>
                        {item.name}
                    </Text>
                    <Text>{item.facts}</Text>
                    <Text style={{ marginTop: -2 }}>{item.handling}</Text>
                    <Text style={{ fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>{item.description}</Text>
                </View>
            ))}

            <TouchableOpacity onPress={toggleShow} style={{ alignItems: 'center' }}>
                <Iconify icon={showAll ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'} size={24} />
            </TouchableOpacity>
        </ScrollView>
    );
}
