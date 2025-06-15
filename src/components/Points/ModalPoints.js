import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Modal, Portal } from 'react-native-paper';
// components
import { Iconify } from 'react-native-iconify';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function ModalPoints({ data, style = {}, textStyle = {} }) {
    const [modalVisible, setModalVisible] = useState(false);
    const openModal = () => { setModalVisible(true) };
    const closeModal = () => { setModalVisible(false) };

    return (
        <>
            <TouchableOpacity
                onPress={openModal}
                style={{
                    backgroundColor: '#e5e5e5',
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    margin: 5,
                    borderRadius: 20,
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    ...style,
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                    <Iconify icon="twemoji:coin" color={palette.primary.main} size={8} />
                    <Text style={{ fontWeight: 700, fontSize: 10, ...textStyle }} numberOfLines={1} ellipsizeMode="tail">{data}</Text>
                </View>
            </TouchableOpacity>

            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={closeModal}
                    contentContainerStyle={{
                        backgroundColor: '#fff',
                        margin: 20,
                        borderRadius: 10,
                        alignSelf: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity onPress={closeModal} style={{ alignItems: 'flex-end', padding: 5 }}>
                        <Iconify icon="material-symbols:close" size={18} />
                    </TouchableOpacity>

                    <View
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 30,
                            borderTopColor: "#000",
                            borderTopWidth: 0.8,
                            marginTop: 5,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 700, textAlign: 'center' }}>
                            {data}
                        </Text>
                    </View>
                </Modal>
            </Portal>
        </>
    );
}