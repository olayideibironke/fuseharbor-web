import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { colors, radius, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'copper';

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
  loading?: boolean;
  withArrow?: boolean;
  iconLeft?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  onPress,
  disabled = false,
  loading = false,
  withArrow = true,
  iconLeft,
  fullWidth = false,
  style,
}: ButtonProps) {
  const palette = getPalette(variant, disabled);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          opacity: pressed && !disabled ? 0.92 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {iconLeft ? <View style={styles.iconLeft}>{iconLeft}</View> : null}
        {loading ? (
          <ActivityIndicator color={palette.text} size="small" />
        ) : (
          <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
        )}
        {withArrow && !loading ? (
          <ArrowRight size={16} color={palette.text} strokeWidth={2.25} />
        ) : null}
      </View>
    </Pressable>
  );
}

function getPalette(variant: ButtonVariant, disabled: boolean) {
  if (disabled) {
    return {
      background: 'rgba(140, 135, 127, 0.35)',
      border: 'transparent',
      text: 'rgba(255, 253, 249, 0.85)',
    };
  }

  switch (variant) {
    case 'copper':
      return {
        background: colors.copper,
        border: 'transparent',
        text: colors.white,
      };
    case 'secondary':
      return {
        background: colors.white,
        border: colors.linen,
        text: colors.graphite,
      };
    case 'primary':
    default:
      return {
        background: colors.graphite,
        border: 'transparent',
        text: colors.white,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconLeft: {
    marginRight: 2,
  },
  label: {
    ...typography.button,
  },
});
