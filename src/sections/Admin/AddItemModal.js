import { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { Button, Modal, Portal, Switch, Text, TextInput } from 'react-native-paper';
// firebase
import { firestore } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
// form
import { useForm, Controller } from 'react-hook-form';
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
import { phoneRegExp } from '../../utils/helper';
import LoadingIndicator from '../../components/Animated/LoadingIndicator';

// ----------------------------------------------------------------------

export default function AddItemModal({
    isVisible,
    onClose,
    onSubmit,
    onEdit,
    para,
    loadingButton,
    isEditMode,
    title,
    docId,
    storageFileName
}) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const CMSSchema = Yup.object().shape({
        ...(para.first && { [para.first]: Yup.string().required(`${para.first} is required`) }),
        ...(
            para.second
                ? (Array.isArray(para.second)
                    ? para.second.reduce((acc, key) => {
                        acc[key] = Yup.string().required(`${key} is required`);
                        return acc;
                    }, {})
                    : { [para.second]: Yup.string().required(`${para.second} is required`) })
                : {}
        ),
        ...(para.third && { [para.third]: Yup.number().required(`${para.third} is required`) }),
        ...(para.fourth && { [para.fourth]: Yup.string().required(`${para.fourth} is required`) }),
        ...(para.fifth && { [para.fifth]: Yup.string().required(`${para.fifth} is required`) }),
        ...(para.seventh && { [para.seventh]: Yup.string().required(`${para.seventh} is required`).matches(phoneRegExp, 'Phone number must be a valid number (01XXXXXXXX)') }),
        ...(para.eight && { [para.eight]: Yup.string().required(`${para.eight} is required`) }),
        ...(para.ninth && { [para.ninth]: Yup.array().required(`${para.ninth} is required`) }),
    });

    const defaultValues = useMemo(
        () => ({
            ...(para.first && { [para.first]: '' }),
            ...(para.second && { [para.second]: '' }),
            ...(para.third && { [para.third]: '' }),
            ...(para.fourth && { [para.fourth]: '' }),
            ...(para.fifth && { [para.fifth]: '' }),
            ...(para.sixth && { [para.sixth]: false }),
            ...(para.seventh && { [para.seventh]: '' }),
            ...(para.eight && { [para.eight]: '' }),
            ...(para.ninth && { [para.ninth]: '' }),
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

    const imageName = watch(para.first);

    useEffect(() => {
        if (!isEditMode) {
            reset(defaultValues);
        }
    }, [isEditMode]);

    useEffect(() => {
        setLoading(false);

        if (isEditMode === true) {
            const fetchData = async () => {
                try {
                    const docSnap = await getDoc(doc(firestore, title, docId));
                    if (docSnap.exists()) {
                        const itemData = docSnap.data();
                        if (para.first) {
                            setValue(para.first, itemData[para.first] || '');
                        }
                        if (para.second) {
                            setValue(para.second, itemData[para.second] || '');
                        }
                        if (para.third) {
                            setValue(para.third, Number(itemData[para.third]) || 0);
                        }
                        if (para.fourth) {
                            setValue(para.fourth, itemData[para.fourth] || '');
                        }
                        if (para.fifth) {
                            setValue(para.fifth, itemData[para.fifth] || '');
                        }
                        if (para.sixth) {
                            setValue(para.sixth, itemData[para.sixth] ?? false);
                        }
                        if (para.seventh) {
                            setValue(para.seventh, itemData[para.seventh] || '');
                        }
                        if (para.eight) {
                            setValue(para.eight, itemData[para.eight] || '');
                        }
                        if (para.ninth) {
                            setValue(para.ninth, itemData[para.ninth] || '');
                        }
                    } else {
                        console.warn('Document not found');
                    }
                } catch (error) {
                    Toast.show({ type: 'error', text1: 'Error fetching data.', text2: error.message || 'Please try again later.' });
                }
            };

            fetchData();
        }
    }, [isEditMode, docId]);

    if (loading) return <LoadingIndicator />

    return (
        <Portal>
            <Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 }}>
                {para.first && (<RHFTextInput name={para.first} label={para.first} control={control} errors={errors} />)}

                {para.second && (<RHFTextInput name={para.second} label={para.second} control={control} errors={errors} />)}
                {para.ninth && (<RHFTextInput name={para.ninth} label={para.ninth} control={control} errors={errors} />)}

                {para.third && (<RHFTextInput name={para.third} label={para.third} control={control} errors={errors} />)}

                {para.fourth && (<RHFImagePicker name={para.fourth} control={control} errors={errors} imageName={imageName} storageFileName={storageFileName} />)}

                {para.fifth && (<RHFTextInput name={para.fifth} label={para.fifth} control={control} errors={errors} />)}

                {para.sixth && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, gap: 5 }}>
                        <Text>{para.sixth}</Text>
                        <Controller
                            control={control}
                            name={para.sixth}
                            render={({ field: { onChange, value } }) => (
                                <Switch value={value} onValueChange={onChange} />
                            )}
                        />
                        {errors[para.sixth] && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors[para.sixth]?.message}</Text>}
                    </View>
                )}

                {para.seventh && (<RHFTextInput name={para.seventh} label={para.seventh} control={control} errors={errors} keyboardType="phone-pad" />)}

                {para.eight && (
                    <Controller
                        control={control}
                        name={para.eight}
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
                                {errors[para.eight] && <Text style={{ color: "red", fontSize: 10 }}>{errors[para.eight].message}</Text>}
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
                        {isEditMode ? 'Update' : 'Add'}
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
}
