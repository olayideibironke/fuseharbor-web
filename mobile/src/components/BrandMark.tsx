import { StyleSheet, Text, View } from 'react-native';
import { colors, shadows, typography } from '@/theme';

type BrandMarkProps = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
};

const dimensions = {
  sm: { badge: 36, dot: 10, title: 15, subtitle: 10 },
  md: { badge: 44, dot: 12, title: 17, subtitle: 11 },
  lg: { badge: 56, dot: 14, title: 20, subtitle: 12 },
} as const;

export function BrandMark({ size = 'md', showWordmark = true }: BrandMarkProps) {
  const d = dimensions[size];

  return (
    <View style={styles.row}>
      <View style={styles.badgeWrap}>
        <View
          style={[
            styles.badge,
            shadows.brand,
            { width: d.badge, height: d.badge, borderRadius: d.badge / 2 },
          ]}
        >
          <Text style={[styles.badgeText, { fontSize: d.badge * 0.32 }]}>FH</Text>
        </View>
        <View
          style={[
            styles.dot,
            { width: d.dot, height: d.dot, borderRadius: d.dot / 2 },
          ]}
        />
      </View>

      {showWordmark ? (
        <View style={styles.text}>
          <Text style={[styles.title, { fontSize: d.title }]}>FuseHarbor</Text>
          <Text style={[styles.subtitle, { fontSize: d.subtitle }]}>
            Premium Home Electrification Marketplace
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeWrap: {
    position: 'relative',
  },
  badge: {
    backgroundColor: colors.graphite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontFamily: typography.h2.fontFamily,
    letterSpacing: 0.5,
  },
  dot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.copper,
    borderWidth: 2,
    borderColor: colors.white,
  },
  text: {
    flexShrink: 1,
  },
  title: {
    color: colors.graphite,
    fontFamily: typography.h2.fontFamily,
    letterSpacing: -0.2,
  },
  subtitle: {
    color: colors.stone,
    fontFamily: typography.small.fontFamily,
    marginTop: 2,
  },
});
