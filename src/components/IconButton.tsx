import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/global';
import styles from './IconButton.styles';

type Props = {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  color?: string;
  onPress?: () => void;
  label?: string;
  style?: object;
  labelStyle?: object;
};

export default function IconButton({ name, size = 20, color = colors.text, onPress, label, style, labelStyle }: Props) {
  const content = (
    <>
      <MaterialIcons name={name} size={size} color={color} />
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.container, style]}>
      {content}
    </View>
  );
}

