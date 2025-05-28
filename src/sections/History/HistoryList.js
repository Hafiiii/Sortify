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

            <View style={{ width: '75%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '85%', paddingVertical: 3, paddingHorizontal: 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View>
                        <Text style={{ fontSize: 12 }}>{waste.wasteName}</Text>
                        <Text style={{ fontSize: 12, fontWeight: 700, lineHeight: 15 }} numberOfLines={3}>{waste.wasteType.join(', ')}</Text>
                    </View>

                    <Text style={{ fontSize: 9, color: palette.disabled.main }}>
                        {waste.dateAdded ? moment(waste.dateAdded.toDate()).format('DD-MM-YYYY hh.mmA') : 'N/A'}
                    </Text>
                </View>

                <View style={{ width: '15%', padding: 5, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View
                        style={{
                            backgroundColor: '#e5e5e5',
                            paddingVertical: 1,
                            paddingHorizontal: 7,
                            borderRadius: 20,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Iconify icon="twemoji:coin" color={palette.primary.main} size={10} />
                        <Text style={{ fontWeight: 700, fontSize: 11, marginLeft: 8 }}>{waste.point}</Text>
                    </View>

                    <TouchableOpacity onPress={() => onDelete(waste.wasteId)}>
                        <Iconify icon="ic:outline-delete" color="#000" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}