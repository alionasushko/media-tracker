import { StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Button, Icon, type ButtonProps } from 'react-native-paper';

interface Props extends ButtonProps {
  size?: 'default' | 'large';
}

const AppButton = ({ size = 'default', style, contentStyle, labelStyle, icon, ...rest }: Props) => {
  if (size === 'large') {
    return (
      <Button
        {...rest}
        style={[styles.base, style] as StyleProp<ViewStyle>}
        contentStyle={[styles.largeContent, contentStyle]}
        labelStyle={[styles.largeLabel, labelStyle as StyleProp<TextStyle>]}
        icon={
          typeof icon === 'string'
            ? ({ color, size: defaultSize }) => (
                <Icon source={icon} color={color} size={defaultSize + 6} />
              )
            : icon
        }
      />
    );
  }

  return (
    <Button
      {...rest}
      style={[styles.base, style] as StyleProp<ViewStyle>}
      contentStyle={contentStyle}
      labelStyle={[styles.defaultLabel, labelStyle]}
      icon={icon}
    />
  );
};

const styles = StyleSheet.create({
  base: { borderRadius: 12 },
  defaultLabel: { fontFamily: 'Inter-Medium', fontSize: 14 },
  largeContent: { height: 52 },
  largeLabel: { fontFamily: 'Inter-SemiBold', fontSize: 16 },
});

export default AppButton;
