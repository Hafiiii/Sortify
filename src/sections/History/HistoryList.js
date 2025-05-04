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
                height: 100,
                borderRadius: 20,
                marginVertical: 10,
                boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
                flexDirection: 'row',
            }}
        >
            <Image
                source={waste.photoURL ? { uri: waste.photoURL } : require("../../../assets/sortify-logo.png")}
                style={{
                    width: '25%',
                    height: '100%',
                    resizeMode: 'cover',
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                }}
            />
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', padding: 10, width: '75%', borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 700 }}>{waste.wasteType}</Text>
                        <View
                            style={{
                                backgroundColor: '#e5e5e5',
                                paddingVertical: 5,
                                paddingHorizontal: 8,
                                borderRadius: 20,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Iconify icon="twemoji:coin" color={palette.primary.main} size={15} />
                            <Text style={{ fontWeight: 700, fontSize: 12, marginLeft: 12 }}>{waste.point}</Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 12 }}>{waste.wasteName}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: palette.disabled.main }}>
                        {waste.dateAdded ? moment(waste.dateAdded.toDate()).format('DD-MM-YYYY hh.mmA') : 'N/A'}
                    </Text>

                    <TouchableOpacity onPress={() => onDelete(waste.wasteId)}>
                        <Iconify icon="ic:outline-delete" color="#000" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}