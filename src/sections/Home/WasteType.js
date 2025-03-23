import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Button, Icon, ProgressBar } from 'react-native-paper';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// components
import { Iconify } from 'react-native-iconify';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function WasteType() {
    return (
        <View style={{ padding: 30 }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{ fontSize: 16, fontWeight: 700 }}>Explore Waste Type</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{color: palette.disabled.main}}>See all</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}