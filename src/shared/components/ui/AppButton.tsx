import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Button, Icon, type ButtonProps } from 'react-native-paper';

interface Props extends ButtonProps {
  size?: 'default' | 'large';
}

const AppButton = ({ size = 'default', style, contentStyle, labelStyle, icon, ...rest }: Props) => {
  if (size === 'large') {
    return (
      <Button
        {...rest}
        style={style as StyleProp<ViewStyle>}
        contentStyle={[{ height: 56 }, contentStyle]}
        labelStyle={[{ fontSize: 18 }, labelStyle as StyleProp<TextStyle>]}
        icon={
          typeof icon === 'string'
            ? ({ color, size: defaultSize }) => (
                <Icon source={icon} color={color} size={defaultSize + 8} />
              )
            : icon
        }
      />
    );
  }

  return (
    <Button
      {...rest}
      style={style}
      contentStyle={contentStyle}
      labelStyle={labelStyle}
      icon={icon}
    />
  );
};

export default AppButton;
