import { View, Image, ScrollView } from 'react-native';
import { TextInput, Button, Text, Switch } from 'react-native-paper';
// form
import { Controller } from 'react-hook-form';
// components
import palette from '../../theme/palette';
import { ReturnButton } from '../../components/GoBackButton/GoBackButton';
import StarRating from '../../components/StarRating/StarRating';

// ----------------------------------------------------------------------

export default function SupportSkeleton({
    title,
    description,
    control,
    errors,
    handleSubmit,
    onSubmit,
    loading,
    includeRating = false,
    rating,
    setRating,
    includeAnonymous = false,
    isAnonymous,
    setIsAnonymous,
    includeImage = false,
    selectedImage,
    pickImage,
    children,
}) {
    return (
        <ScrollView contentContainerStyle={{ padding: 30 }} showsVerticalScrollIndicator={false}>
            <ReturnButton />

            <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <Image source={require('../../../assets/sortify-logo.png')} style={{ width: 60, height: 75, marginBottom: 20 }} resizeMode="contain" />
                <Text style={{ fontSize: 20, fontWeight: '900', marginBottom: 10 }}>{title}</Text>
                <Text style={{ color: palette.disabled.secondary, marginBottom: 10, textAlign: 'justify', lineHeight: 22 }}>{description}</Text>
            </View>

            {includeAnonymous && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <Text>Want to remain anonymous?</Text>
                    <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
                </View>
            )}

            {includeRating && (
                <>
                    <StarRating rating={rating} setRating={setRating} />
                    {errors.rating && <Text style={{ color: palette.error.main }}>{errors.rating.message}</Text>}
                </>
            )}

            {!isAnonymous && (
                <>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <View style={{ marginBottom: 15 }}>
                                <TextInput
                                    label="Name"
                                    value={value}
                                    onChangeText={onChange}
                                    error={!!errors.name}
                                    underlineStyle={{ backgroundColor: 'transparent' }}
                                    style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 45 }}
                                />
                                {errors.name && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors.name.message}</Text>}
                            </View>
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <View style={{ marginBottom: 15 }}>
                                <TextInput
                                    label="Email"
                                    value={value}
                                    onChangeText={onChange}
                                    keyboardType="email-address"
                                    error={!!errors.email}
                                    underlineStyle={{ backgroundColor: 'transparent' }}
                                    style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#000', borderRadius: 8, height: 45 }}
                                />
                                {errors.email && <Text style={{ color: palette.error.main, fontSize: 10 }}>{errors.email.message}</Text>}
                            </View>
                        )}
                    />
                </>
            )}

            {children}

            {includeImage && (
                <View style={{ marginBottom: 15 }}>
                    <Button mode="outlined" onPress={pickImage} style={{ borderColor: '#000' }} labelStyle={{ color: '#000' }}>
                        {selectedImage ? 'Change Image' : 'Attach Image (Optional)'}
                    </Button>
                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage.uri }}
                            style={{ width: '100%', height: 200, marginTop: 10, borderRadius: 8, borderWidth: 1, borderColor: '#000' }}
                            resizeMode="cover"
                        />
                    )}
                </View>
            )}

            <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={loading}
                style={{ backgroundColor: '#000' }}
                labelStyle={{ color: '#fff' }}
            >
                Submit
            </Button>
        </ScrollView>
    );
}
