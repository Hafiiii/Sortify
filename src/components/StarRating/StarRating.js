import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// components
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function StarRating({ rating, setRating }) {
    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={{ fontSize: 24, color: star <= rating ? palette.warning.main : palette.disabled.main }}>★</Text>
            </TouchableOpacity>
        ));
    };

    return (
        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
            {renderStars()}
        </View>
    );
}
