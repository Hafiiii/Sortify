import { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text, Menu, Modal, Portal, Button } from 'react-native-paper';
import moment from 'moment';
// components
import { Iconify } from 'react-native-iconify';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function AdminList({ data, onDelete, onEdit, modal, isArray }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const openMenu = () => { setMenuVisible(true) };
    const closeMenu = () => setMenuVisible(false);
    const openModal = () => {
        closeMenu();
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
    };

    const formattedDate = data.date ? moment(data.date.toDate()).format('DD-MM-YYYY hh.mmA') : null;
    const isRecyclable = data.isRecyclable ? data.isRecyclable === true || data.isRecyclable === 'true' : null;

    const detailItems = modal
        ? [
            [modal.first, `${data.first} ${data.second}`],
            [modal.second, data.third || '-'],
            [modal.third, data.fourth || '-'],
            [modal.fourth, data.id || '-'],
            [modal.fifth, formattedDate],
            [modal.sixth, data.points || 0],
            [modal.seventh, data.totalWaste || 0],
            [modal.eight, data.fifth || '-'],
            [modal.ninth, data.sixth || '-'],
        ]
        : [];

    return (
        <View
            style={{
                height: 90,
                borderRadius: 10,
                marginVertical: 3,
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 5,
                backgroundColor: '#fff',
                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
            }}
        >
            <Image
                source={data.image ? { uri: data.image } : require("../../../assets/sortify-logo.png")}
                style={{
                    width: '25%',
                    height: '100%',
                    resizeMode: 'cover',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                }}
            />

            {isArray ? (
                <View style={{ width: '60%', paddingVertical: 5, flexDirection: 'column', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 12, fontWeight: '700' }}>{data.first}</Text>
                        {Array.isArray(data.second) && (
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>
                                {data.second.join(', ')}
                            </Text>
                        )}
                    </View>
                </View>
            ) : (
                <View style={{ width: '60%', paddingVertical: 5, flexDirection: 'column', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 12, fontWeight: '700' }}>{data.first} {data.second}</Text>
                        {Array.isArray(data.data.third) ? (
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>
                                {data.data.third.join(', ')}
                            </Text>
                        ) : (
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>{data.data.third}</Text>
                        )}
                        {data.third && <Text style={{ fontSize: 11, color: palette.disabled.tertiery, overflow: 'hidden' }}>{data.third}</Text>}
                        {data.fourth && <Text style={{ fontSize: 11, color: palette.disabled.tertiery }}>{data.fourth}</Text>}
                    </View>

                    {data.isRecyclable &&
                        <Text style={{ fontSize: 10, color: isRecyclable ? 'green' : 'red' }}>
                            {isRecyclable ? 'Recyclable' : 'Not Recyclable'}
                        </Text>
                    }
                    {data.date && <Text style={{ fontSize: 10, color: palette.disabled.main }}>{formattedDate}</Text>}
                </View>
            )}

            <View style={{ width: '10%', justifyContent: 'space-between', alignItems: 'flex-end', paddingVertical: 5, paddingRight: 5 }}>
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <TouchableOpacity onPress={openMenu}>
                            <Iconify icon="ph:dots-three-vertical-bold" size={16} />
                        </TouchableOpacity>
                    }
                    contentStyle={{ backgroundColor: '#fff' }}
                >
                    {modal &&
                        <Menu.Item onPress={openModal} title="View Details" />
                    }
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                            onEdit();
                        }}
                        title="Edit"
                    />
                    <Menu.Item onPress={onDelete} title="Delete" />
                </Menu>

                {data.points &&
                    <View
                        style={{
                            backgroundColor: '#e5e5e5',
                            paddingVertical: 3,
                            paddingHorizontal: 6,
                            borderRadius: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Iconify icon="twemoji:coin" color={palette.primary.main} size={12} />
                        <Text style={{ fontWeight: 700, fontSize: 10, marginLeft: 5 }}>{data.points || 0}</Text>
                    </View>
                }
            </View>

            {
                modal && (
                    <Portal>
                        <Modal
                            visible={modalVisible}
                            onDismiss={closeModal}
                            contentContainerStyle={{
                                backgroundColor: 'white',
                                padding: 20,
                                margin: 20,
                                borderRadius: 10,
                            }}
                        >
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{ fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>DETAILS</Text>

                                {detailItems.map(([label, value], index) => (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingVertical: 6,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#e5e5e5',
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, fontWeight: 700, width: '30%' }}>{label}</Text>
                                        <Text style={{ fontSize: 12, width: '65%', textAlign: 'right' }}>{value}</Text>
                                    </View>
                                ))}
                            </View>

                            <Button onPress={closeModal} style={{ marginTop: 20 }}>Close</Button>
                        </Modal>
                    </Portal>
                )
            }
        </View >
    );
}