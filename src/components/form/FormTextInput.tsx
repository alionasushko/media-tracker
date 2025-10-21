import type { ComponentProps } from 'react';
import { Control, Controller } from 'react-hook-form';
import { HelperText, TextInput } from 'react-native-paper';
import { View } from 'react-native';

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  textInputProps?: Omit<ComponentProps<typeof TextInput>, 'label' | 'value' | 'onChangeText'>;
}

const FormTextInput = ({ control, name, label, textInputProps }: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View>
          <TextInput
            label={label}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!error}
            {...textInputProps}
          />
          {error ? <HelperText type="error">{error.message}</HelperText> : null}
        </View>
      )}
    />
  );
};

export default FormTextInput;
