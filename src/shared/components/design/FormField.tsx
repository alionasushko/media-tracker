import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import Field from './Field';
import type { ComponentProps } from 'react';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  helper?: string;
  fieldProps?: Omit<ComponentProps<typeof Field>, 'label' | 'value' | 'onChangeText'>;
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  helper,
  fieldProps,
}: Props<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
      <Field
        label={label}
        helper={helper}
        error={error?.message ?? null}
        value={value ?? ''}
        onChangeText={onChange}
        onBlur={onBlur}
        {...fieldProps}
      />
    )}
  />
);

export default FormField;
