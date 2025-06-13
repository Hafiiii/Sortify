import { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
// sections
import RecyclingValueBottom from './RecyclingValueBottom';
// components
import { HeaderTriple } from '../../components/Header/Header';
import palette from '../../theme/palette';
import CircularProgress from '../../components/Animated/CircularProgress';
import { Star2 } from '../../components/Icon/Star';

// ----------------------------------------------------------------------

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------

export default function RecyclingValue() {
    const [circularValue, setCircularValue] = useState(0);

    return (
        <View style={{ flex: 1, width: width, height: height, backgroundColor: palette.secondary.main }}>
            <View style={{ padding: 20, paddingBottom: 5 }}>
                <HeaderTriple title="RECYCLING VALUE CALCULATOR" style={{ fontWeight: 700 }} />
            </View>

            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 15 }}>
                <Star2 />
                <CircularProgress value={parseFloat(circularValue).toFixed(2)} />
                <Text style={{ marginTop: 10, textAlign: 'center' }}>You can earn money by recycling at your nearest recycling center.</Text>
            </View>

            <RecyclingValueBottom setCircularValue={setCircularValue} />
        </View>
    );
}