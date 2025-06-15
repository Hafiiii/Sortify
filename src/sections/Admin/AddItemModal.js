import { useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Button, Modal, Portal, Switch, Text, TextInput } from 'react-native-paper';
// form
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// components
import RHFTextInput from '../../components/RHFTextInput/RHFTextInput';
import RHFImagePicker from '../../components/RHFImagePicker/RHFImagePicker';
import palette from '../../theme/palette';
import { Iconify } from 'react-native-iconify';
import LoadingIndicator from '../../components/Animated/LoadingIndicator';

// ----------------------------------------------------------------------

export default function AddItemModal({
    isVisible,
    onClose,
    onSubmit,
    addData,
    loadingButton,
    storageFileName
}) {
    const [loading, setLoading] = useState(false);

    const CMSSchema = Yup.object().shape({
        ...(addData.first && { [addData.first]: Yup.string().required(`${addData.first} is required`) }),
        ...(addData.second && { [addData.second]: Yup.string().required(`${addData.second} is required`) }),
        ...(addData.third && { [addData.third]: Yup.string().required(`${addData.third} is required`) }),
        ...(addData.fourth && { [addData.fourth]: Yup.string().required(`${addData.fourth} is required`) }),
        ...(addData.fifth && { [addData.fifth]: Yup.string().required(`${addData.fifth} is required`) }),
        ...(addData.sixth && { [addData.sixth]: Yup.string().required(`${addData.sixth} is required`) }),
        ...(addData.seventh && {
            [addData.seventh]: Yup.array().of(Yup.string().required('This field is required')),
        }),
        ...(addData.eight && {
            [addData.eight]: Yup.array().of(Yup.string().required('This field is required')),
        }),
    });

    const defaultValues = useMemo(
        () => ({
            ...(addData.first && { [addData.first]: '' }),
            ...(addData.second && { [addData.second]: '' }),
            ...(addData.third && { [addData.third]: '' }),
            ...(addData.fourth && { [addData.fourth]: '' }),
            ...(addData.fifth && { [addData.fifth]: '' }),
            ...(addData.sixth && { [addData.sixth]: false }),
            ...(addData.seventh && { [addData.seventh]: [''] }),
            ...(addData.eight && { [addData.eight]: [''] }),
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

    const imageName = watch(addData.first);

    const seventhFieldArray = useFieldArray({
        control,
        name: addData.seventh || 'seventh',
    });

    const eightFieldArray = useFieldArray({
        control,
        name: addData.eight || 'eight',
    });

    if (loading) return <LoadingIndicator />

    return (
        <Portal>
            <Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 }}>
                {addData.first && (<RHFTextInput name={addData.first} label={addData.first} control={control} errors={errors} />)}

                {addData.second && (<RHFTextInput name={addData.second} label={addData.second} control={control} errors={errors} />)}

                {addData.third && (<RHFTextInput name={addData.third} label={addData.third} control={control} errors={errors} />)}

                {addData.fourth && (<RHFImagePicker name={addData.fourth} control={control} errors={errors} imageName={imageName} storageFileName={storageFileName} />)}

                {addData.fifth && (<RHFTextInput name={addData.fifth} label={addData.fifth} control={control} errors={errors} />)}

                {addData.sixth && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, gap: 5 }}>
                        <Text>{addData.sixth}</Text>
                        <Controller
                            control={control}
                            name={addData.sixth}
                            render={({ field: { onChange, value } }) => (
                                <Switch value={value} onValueChange={onChange} />
                            )}
                        />
                        {errors[addData.sixth] && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors[addData.sixth]?.message}</Text>}
                    </View>
                )}

                {addData.seventh && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 8 }}>{addData.seventh}</Text>

                        {seventhFieldArray.fields.map((field, index) => (
                            <View key={field.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Controller
                                    control={control}
                                    name={`${addData.seventh}[${index}]`}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            mode="outlined"
                                            style={{ flex: 1 }}
                                            placeholder={`Enter ${addData.seventh} ${index + 1}`}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                                <TouchableOpacity onPress={() => seventhFieldArray.remove(index)} style={{ marginLeft: 8 }}>
                                    <Iconify icon="material-symbols:close" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <Button
                            onPress={() => seventhFieldArray.append('')}
                            mode="outlined"
                            icon="plus"
                            style={{ marginTop: 10 }}
                        >
                            Add {addData.seventh}
                        </Button>
                    </View>
                )}

                {addData.eight && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ marginBottom: 8 }}>{addData.eight}</Text>

                        {eightFieldArray.fields.map((field, index) => (
                            <View key={field.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Controller
                                    control={control}
                                    name={`${addData.eight}[${index}]`}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            mode="outlined"
                                            style={{ flex: 1 }}
                                            placeholder={`Enter ${addData.eight} ${index + 1}`}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                                <TouchableOpacity onPress={() => eightFieldArray.remove(index)} style={{ marginLeft: 8 }}>
                                    <Iconify icon="material-symbols:close" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <Button
                            onPress={() => eightFieldArray.append('')}
                            mode="outlined"
                            icon="plus"
                            style={{ marginTop: 10 }}
                        >
                            Add {addData.eight}
                        </Button>
                    </View>
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
                        onPress={handleSubmit((data) => onSubmit(data, reset))}
                        loading={isSubmitting}
                        disabled={loadingButton}
                        style={{ backgroundColor: '#000' }}
                        labelStyle={{ color: '#fff' }}
                    >
                        Add
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
}
