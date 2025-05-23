import { View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
// form
import { Controller } from 'react-hook-form';
// components
import palette from '../../theme/palette';

// ----------------------------------------------------------------------

export default function RHFTextInput({
  name,
  control,
  onChange,
  value,
  label,
  errors,
  secureTextEntry = false,
  showPasswordToggle,
  showPassword,
  setShowPassword,
  keyboardType = 'default',
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={{ marginBottom: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              label={label}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value?.toString() ?? ''}
              secureTextEntry={secureTextEntry && !showPassword}
              error={!!errors[name]}
              underlineStyle={{ backgroundColor: 'transparent' }}
              keyboardType={keyboardType}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '#000',
                borderRadius: 8,
                height: 50
              }}
            />
            {showPasswordToggle && (
              <Iconify
                icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                onPress={() => setShowPassword(!showPassword)}
                size={24}
                style={{ marginLeft: -40, marginRight: 15, color: palette.disabled.main }}
              />
            )}
          </View>
          {errors[name] && (
            <Text style={{ color: palette.error.main, marginBottom: -9, fontSize: 10 }}>
              {errors[name].message}
            </Text>
          )}
        </View>
      )}
    />
  );
}
