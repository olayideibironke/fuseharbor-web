import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, typography } from '@/theme';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  eyebrowColor?: 'copper' | 'moss';
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  eyebrowColor = 'copper',
  style,
}: SectionHeaderProps) {
  return (
    <View style={style}>
      <Text
        style={[
          styles.eyebrow,
          { color: eyebrowColor === 'moss' ? colors.moss : colors.copper },
        ]}
      >
        {eyebrow}
      </Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...typography.eyebrow,
  },
  title: {
    ...typography.h1,
    color: colors.graphite,
    marginTop: 12,
  },
  description: {
    ...typography.body,
    color: colors.stone,
    marginTop: 12,
  },
});
