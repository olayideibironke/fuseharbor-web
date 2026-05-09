import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '@/theme';

type CardTone = 'white' | 'sand' | 'warm';

type CardProps = {
  children: ReactNode;
  tone?: CardTone;
  style?: StyleProp<ViewStyle>;
  padding?: number;
};

export function Card({ children, tone = 'white', style, padding = 22 }: CardProps) {
  const palette = getTone(tone);

  return (
    <View
      style={[
        styles.base,
        shadows.card,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          padding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function getTone(tone: CardTone) {
  switch (tone) {
    case 'sand':
      return { background: colors.sand, border: colors.sand };
    case 'warm':
      return { background: colors.warmWhite, border: colors.linen };
    case 'white':
    default:
      return { background: colors.white, border: colors.linen };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xxl,
    borderWidth: 1,
  },
});
