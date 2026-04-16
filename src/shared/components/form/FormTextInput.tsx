import type { ComponentProps } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  textInputProps?: Omit<ComponentProps<typeof TextInput>, 'label' | 'value' | 'onChangeText'>;
}

const FormTextInput = <T extends FieldValues>({
  control,
  name,
  label,
  textInputProps,
}: Props<T>) => {
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
