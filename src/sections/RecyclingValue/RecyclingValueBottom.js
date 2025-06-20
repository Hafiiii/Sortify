import { useState } from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
// components
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

const RECYCLING_RATES_KG = [
    { id: '1', label: 'Newspaper', rate: 0.40 },
    { id: '2', label: 'Black and White Paper', rate: 0.30 },
    { id: '3', label: 'Mixed Paper', rate: 0.10 },
    { id: '4', label: 'Box', rate: 0.20 },
    { id: '5', label: 'Plastic', rate: 0.20 },
    { id: '6', label: 'Aluminum Can', rate: 4.00 },
    { id: '7', label: 'Metal', rate: 0.60 },
    { id: '8', label: "Car's Battery", rate: 2.50 },
    { id: '9', label: 'Tin', rate: 0.20 },
    { id: '10', label: 'Electrical Good', rate: 0.20 },
    { id: '11', label: 'Used Cooking Oil', rate: 2.00 },
];

const RECYCLING_RATES_UNIT = [
    { id: '1', label: 'CPU Set', rate: 1.00 },
    { id: '2', label: 'Monitor', rate: 3.00 },
    { id: '3', label: 'TV', rate: 3.00 },
    { id: '4', label: 'Washing Machine', rate: 4.00 },
    { id: '5', label: 'Refrigerator', rate: 4.00 },
];

const GREEN_BARTER_TRADE = [
    { id: '1', label: 'Newspaper (5kg)', reward: '1 kg Compost' },
    { id: '2', label: 'Cardboard (25kg)', reward: '1 Tissue box + 1 kg Compost' },
    { id: '3', label: 'Mixed Paper (100kg)', reward: '1 Bag toilet paper + 1 kg Compost' },
    { id: '4', label: 'Aluminium Can (0.5kg)', reward: '1 kg Compost' },
    { id: '5', label: 'Aluminium Can (30kg)', reward: '1 Tissue box + 1 kg Compost' },
    { id: '6', label: 'Aluminium Can (70kg)', reward: '1 Bag toilet paper + 2 kg Compost' },
    { id: '7', label: 'Plastic (5kg)', reward: '1 kg Compost' },
    { id: '8', label: 'Plastic (10kg)', reward: '1 Tissue box + 1 kg Compost' },
    { id: '9', label: 'Plastic (60kg)', reward: '1 Bag toilet paper + 1 kg Compost' },
    { id: '10', label: 'Monitor', reward: '5 kg Compost or 1 kg Compost + 1 Tissue box' },
    { id: '11', label: 'CPU (5kg)', reward: '3 kg Compost or 1 Tissue box' },
];

// ----------------------------------------------------------------------

export default function RecyclingValueBottom({ setCircularValue }) {
    return (
        <View
            style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                flex: 1,
                paddingHorizontal: 10,
                paddingTop: 10,
            }}
        >
            <Text style={{ fontSize: 16, fontWeight: 700, textAlign: 'center', marginBottom: 10 }}>CALCULATOR</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
                <RecyclingCalculator
                    title="Weight-based (per kg)"
                    data={RECYCLING_RATES_KG}
                    onValueChange={(val) => setCircularValue(val)}
                />

                <RecyclingCalculator
                    title="Item-based (per unit)"
                    data={RECYCLING_RATES_UNIT}
                    onValueChange={(val) => setCircularValue(val)}
                />

                <View
                    style={{
                        marginHorizontal: 10,
                        marginBottom: 10,
                        padding: 15,
                        borderRadius: 15,
                        boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Green Barter Trade (GBT)</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                            borderBottomWidth: 0.8,
                            borderColor: palette.disabled.main,
                            paddingBottom: 8,
                            marginBottom: 8,
                        }}
                    >
                        <Text style={{ width: '30%' }}>Recyclable Item</Text>
                        <Text style={{ width: '65%', textAlign: 'right' }}>Exchange Product</Text>
                    </View>

                    {GREEN_BARTER_TRADE.map((item) => (
                        <View
                            key={item.id}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5,
                                marginBottom: 5,
                                borderBottomWidth: 0.2,
                                borderColor: palette.disabled.main,
                                paddingBottom: 8,
                            }}
                        >
                            <Text style={{ width: '30%' }}>{item.label}</Text>
                            <Text style={{ width: '65%', textAlign: 'right' }}>{item.reward}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ margin: 10 }}>
                    <Text style={{ fontSize: 12, fontStyle: 'italic', color: palette.disabled.main, textAlign: 'justify' }}>
                        Prices are estimated only and may vary. Please check with your local recycling center.
                    </Text>
                    <Text style={{ fontSize: 12, fontStyle: 'italic', color: palette.disabled.main, marginTop: 5 }}>
                        Sources: DBKU (Dewan Bandaraya Kuching Utara) & Environmental Health Division
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

function RecyclingCalculator({ title, data, onValueChange }) {
    const [rate, setRate] = useState(data[0].rate);
    const [quantity, setQuantity] = useState('');
    const [value, setValue] = useState(null);

    const calculateValue = () => {
        const qty = parseFloat(quantity);
        if (!isNaN(qty)) {
            const result = (qty * rate).toFixed(2);
            setValue(result);
            onValueChange(result);
        } else {
            setValue(null);
            onValueChange(0);
        }
    };

    return (
        <View
            style={{
                marginHorizontal: 10,
                marginBottom: 10,
                padding: 15,
                borderRadius: 15,
                boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.2)',
            }}
        >
            <Text style={{ fontWeight: 700, marginBottom: 5 }}>{title}</Text>

            <View
                style={{
                    borderColor: palette.disabled.main,
                    borderWidth: 0.5,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginBottom: 10,
                }}
            >
                <Picker
                    selectedValue={rate}
                    onValueChange={(value) => setRate(value)}
                    style={{ height: 53, color: '#000' }}
                >
                    {data.map((item) => (
                        <Picker.Item key={item.id} label={item.label} value={item.rate} />
                    ))}
                </Picker>
            </View>

            <TextInput
                style={{
                    borderWidth: 0.5,
                    borderColor: palette.disabled.main,
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 10,
                    height: 53,
                }}
                
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                placeholder={`e.g: 5`}
                placeholderTextColor={palette.disabled.main}
                maxLength={6}
            />

            <Button
                mode="contained"
                onPress={calculateValue}
                style={{ backgroundColor: '#000' }}
                labelStyle={{ color: '#fff' }}
            >
                Calculate
            </Button>
        </View>
    );
}