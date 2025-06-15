import { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { Button, Modal, Portal, Switch, Text, TextInput } from 'react-native-paper';
// firebase
import { firestore } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
// form
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// datepicker
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";
// components
import RHFTextInput from '../../components/RHFTextInput/RHFTextInput';
import RHFImagePicker from '../../components/RHFImagePicker/RHFImagePicker';
import palette from '../../theme/palette';
import { Iconify } from 'react-native-iconify';
import LoadingIndicator from '../../components/Animated/LoadingIndicator';

// ----------------------------------------------------------------------

export default function EditItemModal({
    isVisible,
    onClose,
    onSubmit,
    editData,
    loadingButton,
    title,
    docId,
    storageFileName
}) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const CMSSchema = Yup.object().shape({
        ...(editData.first && { [editData.first]: Yup.string().required(`${editData.first} is required`) }),
        ...(editData.second && { [editData.second]: Yup.string().required(`${editData.second} is required`) }),
        ...(editData.third && { [editData.third]: Yup.number().required(`${editData.third} is required`) }),
        ...(editData.fifth && { [editData.fifth]: Yup.string().required(`${editData.fifth} is required`) }),
    });

    const defaultValues = useMemo(
        () => ({
            ...(editData.first && { [editData.first]: '' }),
            ...(editData.second && { [editData.second]: '' }),
            ...(editData.third && { [editData.third]: '' }),
            ...(editData.fourth && { [editData.fourth]: '' }),
            ...(editData.fifth && { [editData.fifth]: '' }),
            ...(editData.sixth && { [editData.sixth]: false }),
            ...(editData.seventh && { [editData.seventh]: '' }),
            ...(editData.eight && { [editData.eight]: '' }),
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(CMSSchema),
        defaultValues,
    });

    const {
        control,
        reset,
        watch,
        setValue,
        handleSubmit,
        getValues,
        formState: { errors },
        formState: { isSubmitting },
    } = methods;

    const imageName = watch(editData.first);

    useEffect(() => {
        setLoading(false);

        const fetchData = async () => {
            try {
                const docSnap = await getDoc(doc(firestore, title, docId));
                if (docSnap.exists()) {
                    const itemData = docSnap.data();
                    if (editData.first) {
                        setValue(editData.first, itemData[editData.first] || '');
                    }
                    if (editData.second) {
                        setValue(editData.second, itemData[editData.second] || '');
                    }
                    if (editData.third) {
                        setValue(editData.third, Number(itemData[editData.third]) || 0);
                    }
                    if (editData.fourth) {
                        setValue(editData.fourth, itemData[editData.fourth] || '');
                    }
                    if (editData.fifth) {
                        setValue(editData.fifth, itemData[editData.fifth] || '');
                    }
                    if (editData.sixth) {
                        setValue(editData.sixth, itemData[editData.sixth] ?? false);
                    }
                    if (editData.seventh) {
                        setValue(editData.seventh, itemData[editData.seventh] || '');
                    }
                    if (editData.eight) {
                        setValue(editData.eight, itemData[editData.eight] || '');
                    }
                } else {
                    Toast.show({ type: 'error', text1: 'Document not found.', text2: 'Please check the ID and try again.' });
                }
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Error fetching data.', text2: error.message || 'Please try again later.' });
            }
        };

        fetchData();
    }, [docId]);

    if (loading) return <LoadingIndicator />

    return (
        <Portal>
            <Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 }}>
                {editData.first && (<RHFTextInput name={editData.first} label={editData.first} control={control} errors={errors} />)}

                {editData.second && (<RHFTextInput name={editData.second} label={editData.second} control={control} errors={errors} />)}

                {editData.third && (<RHFTextInput name={editData.third} label={editData.third} control={control} errors={errors} />)}

                {editData.fourth && (<RHFImagePicker name={editData.fourth} control={control} errors={errors} imageName={imageName} storageFileName={storageFileName} />)}

                {editData.fifth && (<RHFTextInput name={editData.fifth} label={editData.fifth} control={control} errors={errors} />)}

                {editData.sixth && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, gap: 5 }}>
                        <Text>{editData.sixth}</Text>
                        <Controller
                            control={control}
                            name={editData.sixth}
                            render={({ field: { onChange, value } }) => (
                                <Switch value={value} onValueChange={onChange} />
                            )}
                        />
                        {errors[editData.sixth] && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors[editData.sixth]?.message}</Text>}
                    </View>
                )}

                {editData.seventh && (<RHFTextInput name={editData.seventh} label={editData.seventh} control={control} errors={errors} keyboardType="phone-pad" />)}

                {editData.eight && (
                    <Controller
                        control={control}
                        name={editData.eight}
                        render={({ field: { onChange, value } }) => (
                            <View style={{ marginBottom: 15 }}>
                                <View style={{ position: 'relative' }}>
                                    <TouchableOpacity onPress={() => {
                                        Keyboard.dismiss();
                                        setShowDatePicker(true);
                                    }}
                                    >
                                        <TextInput
                                            placeholder="Date of Birth"
                                            value={value ? dayjs(value).format("DD-MM-YYYY") : ""}
                                            editable={false}
                                            underlineStyle={{ backgroundColor: 'transparent' }}
                                            style={{ backgroundColor: "transparent", borderWidth: 1, borderColor: "#000", borderRadius: 8, height: 45, paddingRight: 40 }}
                                        />
                                        <Iconify
                                            icon={'mdi:calendar-outline'}
                                            size={20}
                                            style={{ position: "absolute", top: "50%", right: 10, transform: [{ translateY: -8 }] }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {showDatePicker && (
                                    <DateTimePicker
                                        mode="date"
                                        value={value ? new Date(value) : new Date()}
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) {
                                                onChange(dayjs(selectedDate).format("YYYY-MM-DD"));
                                            }
                                        }}
                                    />
                                )}
                                {errors[editData.eight] && <Text style={{ color: "red", fontSize: 10 }}>{errors[editData.eight].message}</Text>}
                            </View>
                        )}
                    />
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button
                        onPress={() => {
                            reset(defaultValues);
                            onClose();
                        }}
                        mode="text"
                        style={{ marginRight: 5 }}
                        labelStyle={{ color: palette.disabled.main }}
                    >
                        Cancel
                    </Button>

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                        disabled={loadingButton}
                        style={{ backgroundColor: '#000' }}
                        labelStyle={{ color: '#fff' }}
                    >
                        Update
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
}
