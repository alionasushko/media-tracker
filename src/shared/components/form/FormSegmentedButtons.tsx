import type { ComponentProps } from 'react';
import { Controller, type Control, type FieldValues, type Path, type PathValue } from 'react-hook-form';
import { SegmentedButtons } from 'react-native-paper';

type SegmentedButtonsProps = ComponentProps<typeof SegmentedButtons>;

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  buttons: SegmentedButtonsProps['buttons'];
  density?: SegmentedButtonsProps['density'];
}

const FormSegmentedButtons = <T extends FieldValues>({
  control,
  name,
  buttons,
  density = 'regular',
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <SegmentedButtons
          value={value}
          onValueChange={(v) => onChange(v as PathValue<T, Path<T>>)}
          buttons={buttons}
          density={density}
        />
      )}
    />
  );
};

export default FormSegmentedButtons;
