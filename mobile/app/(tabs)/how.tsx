import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { steps } from '@/data/steps';
import { colors, radius, spacing, typography } from '@/theme';

const trustPoints = [
  'Homeowner intake reviewed before being routed',
  'No spam, no pressure, no resold leads',
  'Maryland-first to keep quality high',
  'Built for serious projects, not casual browsing',
];

export default function HowScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroBlock}>
          <Text style={[typography.eyebrow, { color: colors.moss }]}>
            HOW IT WORKS
          </Text>
          <Text style={styles.title}>
            A cleaner, calmer path to home electrification
          </Text>
          <Text style={styles.body}>
            FuseHarbor is built for homeowners who want trust, clarity, and a
            more premium project experience.
          </Text>
        </View>

        <View style={styles.steps}>
          {steps.map((step) => (
            <Card key={step.number} padding={22}>
              <View style={styles.stepRow}>
                <View style={styles.numberBubble}>
                  <Text style={styles.numberText}>{step.number}</Text>
                </View>
                <View style={styles.stepBody}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <Card padding={26} style={styles.trustCard}>
          <Text style={[typography.eyebrow, { color: colors.copper }]}>
            WHAT TO EXPECT
          </Text>
          <Text style={styles.trustTitle}>
            FuseHarbor treats every homeowner like a serious project
          </Text>

          <View style={styles.trustList}>
            {trustPoints.map((point) => (
              <View key={point} style={styles.trustItem}>
                <CheckCircle2 size={18} color={colors.copper} strokeWidth={2.2} />
                <Text style={styles.trustItemText}>{point}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card tone="warm" padding={26}>
          <Text style={[typography.eyebrow, { color: colors.copper }]}>
            READY?
          </Text>
          <Text style={styles.ctaTitle}>
            Tell us about your home — we will organize the rest
          </Text>
          <Button
            label="Start your quote"
            variant="copper"
            fullWidth
            onPress={() => router.push('/quote')}
            style={{ marginTop: spacing.xl }}
          />
        </Card>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.warmWhite,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.xxl,
  },
  heroBlock: {
    gap: spacing.md,
  },
  title: {
    ...typography.display,
    color: colors.graphite,
  },
  body: {
    ...typography.body,
    color: colors.stone,
  },
  steps: {
    gap: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  numberBubble: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: typography.h2.fontFamily,
    fontSize: 16,
    color: colors.copper,
    letterSpacing: 0.4,
  },
  stepBody: {
    flex: 1,
  },
  stepTitle: {
    ...typography.h3,
    color: colors.graphite,
  },
  stepDescription: {
    ...typography.small,
    color: colors.stone,
    marginTop: 6,
  },
  trustCard: {
    borderColor: colors.linen,
  },
  trustTitle: {
    ...typography.h2,
    color: colors.graphite,
    marginTop: spacing.md,
  },
  trustList: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  trustItemText: {
    ...typography.bodyStrong,
    color: colors.graphite,
    flex: 1,
  },
  ctaTitle: {
    ...typography.h1,
    color: colors.graphite,
    marginTop: spacing.md,
  },
});
