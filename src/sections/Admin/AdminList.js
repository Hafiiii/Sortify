import { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text, Menu, Modal, Portal, Button } from 'react-native-paper';
import dayjs from 'dayjs';
// components
import { Iconify } from 'react-native-iconify';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function AdminList({ data, onDelete, onEdit, modal, editData, isArray, hasImage }) {
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

    const formattedDate = data.date ? dayjs(data.date.toDate()).format('DD-MM-YYYY hh.mmA') : null;
    const isRecyclable = data.isRecyclable ? data.isRecyclable === true || data.isRecyclable === 'true' : null;

    const detailItems = [];

    if (modal) {
        detailItems.push(
            [modal.first, `${data.first || '-'} ${data.second || ''}`.trim()],
            [modal.second, data.third || '-'],
            [modal.fourth, data.id || '-'],
        );

        if (data.fourth) {
            detailItems.splice(2, 0, [modal.third, data.fourth]);
        }

        if (formattedDate) {
            detailItems.push([modal.fifth, formattedDate]);
        }

        if (data.points !== undefined && data.points !== null && data.points !== '') {
            detailItems.push([modal.sixth, data.points]);
        }

        if (data.score !== undefined && data.score !== null) {
            detailItems.push([modal.seventh, data.score]);
        }

        if (data.fifth) {
            detailItems.push([modal.eight, data.fifth]);
        }

        if (data.sixth) {
            detailItems.push([modal.ninth, data.sixth]);
        }

        if (isRecyclable !== null) {
            detailItems.push([modal.tenth, isRecyclable ? 'Recyclable' : 'Not Recyclable']);
        }
    }

    return (
        <>
            {hasImage === false ? (
                <View
                    style={{
                        height: 46,
                        borderRadius: 10,
                        marginVertical: 2,
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 3,
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <View style={{ width: '85%', flexDirection: 'column' }}>
                        <Text style={{ fontSize: 11 }}>{data.first}</Text>
                        {Array.isArray(data.third) ? (
                            <Text style={{ fontSize: 11, fontWeight: '700' }}>
                                {data.third.join(', ')}
                            </Text>
                        ) : (
                            <Text style={{ fontSize: 11, fontWeight: '700' }}>
                                {data.third}
                            </Text>
                        )}
                    </View>

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
                            {modal && <Menu.Item onPress={openModal} title="View Details" />}
                            {editData &&
                                <Menu.Item
                                    onPress={() => {
                                        closeMenu();
                                        onEdit();
                                    }}
                                    title="Edit"
                                />
                            }
                            <Menu.Item onPress={onDelete} title="Delete" />
                        </Menu>
                    </View>
                </View>
            ) : (
                <View
                    style={{
                        height: 72,
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
                        source={data.image ? { uri: data.image } : require("../../../assets/sortify-logo.webp")}
                        style={{
                            width: '20%',
                            height: '100%',
                            resizeMode: 'cover',
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                        }}
                    />

                    {isArray ? (
                        <View style={{ width: '65%', paddingVertical: 5, flexDirection: 'column', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 11 }}>{data.first}</Text>
                                {Array.isArray(data.second) && (
                                    <Text style={{ fontSize: 12, fontWeight: '700' }}>
                                        {data.second.join(', ')}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View style={{ width: '60%', paddingVertical: 3, flexDirection: 'column', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column', gap: 1 }}>
                                <Text style={{ fontSize: 10 }} numberOfLines={1} ellipsizeMode="tail">{data.first} {data.second}</Text>
                                {Array.isArray(data.third) ? (
                                    <Text style={{ fontSize: 10, fontWeight: 700 }} numberOfLines={2} ellipsizeMode="tail">
                                        {data.third.join(', ')}
                                    </Text>
                                ) : (
                                    <Text style={{ fontSize: 10, color: palette.disabled.tertiery, overflow: 'hidden' }} numberOfLines={1} ellipsizeMode="tail">{data.third}</Text>
                                )}
                                {data.fourth && <Text style={{ fontSize: 9, color: palette.disabled.tertiery }}>{data.fourth}</Text>}
                            </View>

                            {data.isRecyclable &&
                                <Text style={{ fontSize: 10, color: isRecyclable ? 'green' : 'red' }}>
                                    {isRecyclable ? 'Recyclable' : 'Not Recyclable'}
                                </Text>
                            }
                            {data.date && <Text style={{ fontSize: 8, color: palette.disabled.main }}>{formattedDate}</Text>}
                        </View>
                    )}

                    <View style={{ width: '15%', justifyContent: 'space-between', alignItems: 'flex-end', paddingVertical: 5, paddingRight: 5 }}>
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
                            {modal && <Menu.Item onPress={openModal} title="View Details" />}
                            {editData &&
                                <Menu.Item
                                    onPress={() => {
                                        closeMenu();
                                        onEdit();
                                    }}
                                    title="Edit"
                                />
                            }
                            <Menu.Item onPress={onDelete} title="Delete" />
                        </Menu>

                        {data.points !== undefined && data.points !== null && (
                            <View
                                style={{
                                    backgroundColor: '#e5e5e5',
                                    paddingVertical: 3,
                                    paddingHorizontal: 4,
                                    borderRadius: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <Iconify icon="twemoji:coin" color={palette.primary.main} size={7} />
                                <Text style={{ fontWeight: 700, fontSize: 8 }} numberOfLines={1} ellipsizeMode="tail">{data.points || 0}</Text>
                            </View>
                        )}
                    </View>
                </View >
            )}

            {modal && (
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
                                    {Array.isArray(value) ? (
                                        <Text style={{ fontSize: 12, width: '65%', textAlign: 'right' }}>{value.join(', ')}</Text>
                                    ) : (
                                        <Text style={{ fontSize: 12, width: '65%', textAlign: 'right' }}>{value}</Text>
                                    )}
                                </View>
                            ))}
                        </View>

                        <Button onPress={closeModal} style={{ marginTop: 20 }}>Close</Button>
                    </Modal>
                </Portal>
            )}
        </>
    );
}