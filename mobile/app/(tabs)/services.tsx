import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight, ShieldCheck } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { IconBadge } from '@/components/IconBadge';
import { SectionHeader } from '@/components/SectionHeader';
import { services } from '@/data/services';
import { colors, spacing, typography } from '@/theme';

export default function ServicesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroBlock}>
          <Text style={[typography.eyebrow, { color: colors.copper }]}>
            SERVICES
          </Text>
          <Text style={styles.title}>
            Premium electrification services for modern homes
          </Text>
          <Text style={styles.body}>
            FuseHarbor begins with the highest-value upgrades homeowners need
            when preparing their homes for the future.
          </Text>
        </View>

        <View style={styles.list}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} padding={24} style={styles.card}>
                <IconBadge size={52}>
                  <Icon size={24} color={colors.copper} strokeWidth={2.2} />
                </IconBadge>
                <Text style={styles.cardTitle}>{service.title}</Text>
                <Text style={styles.cardBody}>{service.longDescription}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>Available in Maryland pilot</Text>
                  <ArrowRight size={16} color={colors.copper} strokeWidth={2.4} />
                </View>
              </Card>
            );
          })}
        </View>

        <Card tone="sand" padding={24} style={styles.trust}>
          <View style={styles.trustHeader}>
            <IconBadge size={44} tone="copper">
              <ShieldCheck size={20} color={colors.white} strokeWidth={2.2} />
            </IconBadge>
            <Text style={styles.trustEyebrow}>WHY HOMEOWNERS START HERE</Text>
          </View>
          <Text style={styles.trustTitle}>
            One organized path for every electrification project
          </Text>
          <Text style={styles.trustBody}>
            Skip generic forms. FuseHarbor structures your project so the right
            local pros can review what you actually need — not a vague lead.
          </Text>

          <Button
            label="Start a quote request"
            variant="primary"
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
  list: {
    gap: spacing.md,
  },
  card: {
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.graphite,
    marginTop: spacing.lg,
  },
  cardBody: {
    ...typography.body,
    color: colors.stone,
    marginTop: spacing.sm,
  },
  cardFooter: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.linen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardFooterText: {
    ...typography.smallStrong,
    color: colors.copper,
  },
  trust: {
    borderColor: colors.sand,
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  trustEyebrow: {
    ...typography.eyebrow,
    color: colors.copper,
  },
  trustTitle: {
    ...typography.h1,
    color: colors.graphite,
    marginTop: spacing.lg,
  },
  trustBody: {
    ...typography.body,
    color: colors.stone,
    marginTop: spacing.md,
  },
});
