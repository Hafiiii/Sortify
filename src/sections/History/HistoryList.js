import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// components
import { Iconify } from 'react-native-iconify';
import palette from '../../theme/palette';
import moment from 'moment';

// ----------------------------------------------------------------------

export default function HistoryList({ waste, onDelete }) {
    return (
        <View
            style={{
                height: 90,
                borderRadius: 10,
                marginVertical: 3,
                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
                flexDirection: 'row',
                backgroundColor: '#fff',
                gap: 10,
            }}
        >
            <Image
                source={waste.photoURL ? { uri: waste.photoURL } : require("../../../assets/sortify-logo.png")}
                style={{
                    width: '25%',
                    height: '100%',
                    resizeMode: 'cover',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                }}
            />

            <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', paddingVertical: 4 }}>
                <View>
                    <Text style={{ fontSize: 12 }}>{waste.wasteName}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 700, lineHeight: 15 }} numberOfLines={3}>{waste.wasteType.join(', ')}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 9, color: palette.disabled.main }}>
                        {waste.dateAdded ? moment(waste.dateAdded.toDate()).format('DD-MM-YYYY hh.mmA') : 'N/A'}
                    </Text>

                    <TouchableOpacity onPress={() => onDelete(waste.wasteId)}>
                        <Iconify icon="ic:outline-delete" color="#000" size={18} />
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    );
}