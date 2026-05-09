import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';

type IconBadgeProps = {
  children: ReactNode;
  size?: number;
  tone?: 'sand' | 'copper';
  style?: StyleProp<ViewStyle>;
};

export function IconBadge({
  children,
  size = 48,
  tone = 'sand',
  style,
}: IconBadgeProps) {
  const background = tone === 'copper' ? colors.copper : colors.sand;

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius.lg,
          backgroundColor: background,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
