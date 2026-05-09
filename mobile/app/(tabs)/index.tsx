import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react-native';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { IconBadge } from '@/components/IconBadge';
import { Pill } from '@/components/Pill';
import { SectionHeader } from '@/components/SectionHeader';
import { services } from '@/data/services';
import { steps } from '@/data/steps';
import { colors, radius, spacing, typography } from '@/theme';

const reassurance = [
  {
    title: 'Built for a focused Maryland pilot',
    description:
      'Starting carefully with a Maryland-first rollout to grow with quality, trust, and real homeowner demand.',
  },
  {
    title: 'Cleaner homeowner intake',
    description:
      'Project details are organized so EV charger, panel, heat pump, and backup power requests can be reviewed clearly.',
  },
  {
    title: 'Local pro network forming',
    description:
      'Built to support qualified local professionals with real project context and a serious homeowner pipeline.',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <BrandMark size="md" showWordmark={false} />
          <Pill label="Maryland-first pilot" />
        </View>

        <View style={styles.hero}>
          <Text style={[typography.eyebrow, styles.heroEyebrow]}>
            MARYLAND-FIRST ELECTRIFICATION PILOT
          </Text>
          <Text style={styles.heroTitle}>
            A cleaner first step for modern home electrification
          </Text>
          <Text style={styles.heroBody}>
            FuseHarbor is an early-stage Maryland marketplace built to help
            homeowners start EV charger, panel upgrade, heat pump, and backup
            power projects with more clarity, structure, and trust.
          </Text>

          <View style={styles.pillRow}>
            <Pill
              label="Maryland-first"
              icon={<MapPin size={13} color={colors.copper} strokeWidth={2.4} />}
            />
            <Pill
              label="Trust-led intake"
              icon={
                <ShieldCheck size={13} color={colors.copper} strokeWidth={2.4} />
              }
            />
            <Pill
              label="Clean upgrades"
              icon={<Zap size={13} color={colors.copper} strokeWidth={2.4} />}
            />
          </View>

          <View style={styles.ctaStack}>
            <Button
              label="Start a quote request"
              variant="primary"
              fullWidth
              onPress={() => router.push('/quote')}
            />
            <Button
              label="Browse services"
              variant="secondary"
              fullWidth
              onPress={() => router.push('/services')}
            />
          </View>
        </View>

        <Card tone="sand" style={styles.reassuranceCard} padding={24}>
          <Text style={[typography.eyebrow, { color: colors.copper }]}>
            WHAT FUSEHARBOR IS BUILDING
          </Text>
          <Text style={styles.reassuranceTitle}>
            A more organized path from homeowner interest to qualified pro
            review
          </Text>

          <View style={styles.reassuranceList}>
            {reassurance.map((item) => (
              <View key={item.title} style={styles.reassuranceItem}>
                <Star
                  size={16}
                  color={colors.copper}
                  strokeWidth={2.2}
                  style={styles.reassuranceIcon}
                />
                <View style={styles.reassuranceTextWrap}>
                  <Text style={styles.reassuranceItemTitle}>{item.title}</Text>
                  <Text style={styles.reassuranceItemBody}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.section}>
          <SectionHeader
            eyebrow="SERVICES"
            title="Premium electrification services"
            description="The highest-value upgrades homeowners need when preparing their homes for the future."
          />

          <View style={styles.serviceGrid}>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} style={styles.serviceCard} padding={20}>
                  <IconBadge size={48}>
                    <Icon size={22} color={colors.copper} strokeWidth={2.2} />
                  </IconBadge>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceBody}>{service.description}</Text>
                </Card>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            eyebrow="HOW IT WORKS"
            title="A cleaner, calmer path to home electrification"
            description="Built for homeowners who want trust, clarity, and a more premium project experience."
            eyebrowColor="moss"
          />

          <View style={styles.stepList}>
            {steps.map((step) => (
              <Card key={step.number} padding={20}>
                <Text style={styles.stepNumber}>{step.number}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.description}</Text>
              </Card>
            ))}
          </View>
        </View>

        <Card style={styles.bottomCta} padding={28}>
          <Text style={[typography.eyebrow, { color: colors.copper }]}>
            READY WHEN YOU ARE
          </Text>
          <Text style={styles.bottomCtaTitle}>
            Tell us about your project — we will help organize the next step
          </Text>
          <Text style={styles.bottomCtaBody}>
            A short, structured intake. No spam, no pressure, no resold leads.
          </Text>

          <View style={styles.bottomCtaPoints}>
            {[
              'Homeowner-first intake',
              'Maryland-first focus',
              'Reviewed before being routed',
            ].map((point) => (
              <View key={point} style={styles.bottomCtaPoint}>
                <CheckCircle2
                  size={16}
                  color={colors.copper}
                  strokeWidth={2.2}
                />
                <Text style={styles.bottomCtaPointText}>{point}</Text>
              </View>
            ))}
          </View>

          <Button
            label="Start your quote"
            variant="copper"
            fullWidth
            onPress={() => router.push('/quote')}
            style={{ marginTop: spacing.xxl }}
          />
        </Card>

        <View style={styles.footer}>
          <BrandMark size="sm" />
          <Text style={styles.footerNote}>
            FuseHarbor — Premium home electrification marketplace.
            {'\n'}Maryland-first. Homeowner-first. Trust-first.
          </Text>
        </View>

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
    paddingBottom: spacing.huge,
    gap: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  hero: {
    paddingTop: spacing.sm,
  },
  heroEyebrow: {
    color: colors.copper,
  },
  heroTitle: {
    ...typography.display,
    color: colors.graphite,
    marginTop: 14,
  },
  heroBody: {
    ...typography.body,
    color: colors.stone,
    marginTop: spacing.lg,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.xxl,
  },
  ctaStack: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  reassuranceCard: {
    borderColor: colors.sand,
  },
  reassuranceTitle: {
    ...typography.h2,
    color: colors.graphite,
    marginTop: 10,
  },
  reassuranceList: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  reassuranceItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 253, 249, 0.8)',
    borderRadius: radius.lg,
    borderColor: colors.linen,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  reassuranceIcon: {
    marginTop: 2,
  },
  reassuranceTextWrap: {
    flex: 1,
  },
  reassuranceItemTitle: {
    ...typography.bodyStrong,
    color: colors.graphite,
  },
  reassuranceItemBody: {
    ...typography.small,
    color: colors.stone,
    marginTop: 4,
  },
  section: {
    gap: spacing.lg,
  },
  serviceGrid: {
    gap: spacing.md,
  },
  serviceCard: {
    gap: spacing.sm,
  },
  serviceTitle: {
    ...typography.h3,
    color: colors.graphite,
    marginTop: spacing.md,
  },
  serviceBody: {
    ...typography.small,
    color: colors.stone,
    marginTop: 4,
  },
  stepList: {
    gap: spacing.md,
  },
  stepNumber: {
    ...typography.eyebrow,
    color: colors.copper,
  },
  stepTitle: {
    ...typography.h3,
    color: colors.graphite,
    marginTop: spacing.sm,
  },
  stepBody: {
    ...typography.small,
    color: colors.stone,
    marginTop: 6,
  },
  bottomCta: {
    backgroundColor: colors.graphite,
    borderColor: colors.graphite,
  },
  bottomCtaTitle: {
    ...typography.h1,
    color: colors.white,
    marginTop: spacing.md,
  },
  bottomCtaBody: {
    ...typography.body,
    color: 'rgba(255, 253, 249, 0.7)',
    marginTop: spacing.md,
  },
  bottomCtaPoints: {
    marginTop: spacing.xl,
    gap: 10,
  },
  bottomCtaPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomCtaPointText: {
    ...typography.smallStrong,
    color: colors.white,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  footerNote: {
    ...typography.small,
    color: colors.stone,
    textAlign: 'center',
  },
});
