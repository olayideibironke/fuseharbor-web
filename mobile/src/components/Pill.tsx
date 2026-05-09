import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, typography } from '@/theme';

type PillProps = {
  label: string;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Pill({ label, icon, style }: PillProps) {
  return (
    <View style={[styles.base, style]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderColor: colors.linen,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  icon: {
    marginRight: 2,
  },
  label: {
    ...typography.smallStrong,
    color: colors.graphite,
  },
});
