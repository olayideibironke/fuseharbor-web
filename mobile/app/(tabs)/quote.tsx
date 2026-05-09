import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  Home as HomeIcon,
  MapPin,
  User,
  Zap,
} from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { IconBadge } from '@/components/IconBadge';
import { services } from '@/data/services';
import { colors, radius, spacing, typography } from '@/theme';

const projectGoals = [
  'I want to start as soon as possible',
  'I am comparing options',
  'I am planning for the next few months',
  'I need guidance before deciding',
];

const propertyTypes = [
  'Single-family home',
  'Townhouse',
  'Condo',
  'Multi-family property',
  'Other',
];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
};

const initialForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zipCode: '',
  notes: '',
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function QuoteScreen() {
  const [selectedService, setSelectedService] = useState(services[0].title);
  const [selectedGoal, setSelectedGoal] = useState(projectGoals[0]);
  const [propertyType, setPropertyType] = useState(propertyTypes[0]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [showValidation, setShowValidation] = useState(false);

  const phoneDigits = form.phone.replace(/\D/g, '');
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const zipValid = /^\d{5}$/.test(form.zipCode.trim());
  const phoneValid = phoneDigits.length === 10;

  const errors = {
    fullName: form.fullName.trim().length === 0,
    email: form.email.trim().length === 0 || !emailValid,
    phone: phoneDigits.length === 0 || !phoneValid,
    address: form.address.trim().length === 0,
    city: form.city.trim().length === 0,
    zipCode: form.zipCode.trim().length === 0 || !zipValid,
  };

  const isValid = useMemo(
    () =>
      !errors.fullName &&
      !errors.email &&
      !errors.phone &&
      !errors.address &&
      !errors.city &&
      !errors.zipCode,
    [errors],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit() {
    setShowValidation(true);
    if (!isValid) {
      Alert.alert(
        'A few details are missing',
        'Please complete all required fields with valid information before submitting.',
      );
      return;
    }
    Alert.alert(
      'Quote request prepared',
      `Thanks ${form.fullName.trim().split(' ')[0]}. Your ${selectedService} request is ready to submit. Wiring this to the FuseHarbor backend is the next step.`,
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <Text style={[typography.eyebrow, { color: colors.copper }]}>
              GET A QUOTE
            </Text>
            <Text style={styles.title}>
              Tell us about your project
            </Text>
            <Text style={styles.body}>
              A short, structured intake — so the right local pros can review
              what you actually need.
            </Text>
          </View>

          <Card padding={22}>
            <View style={styles.stepHeader}>
              <IconBadge size={44}>
                <Zap size={20} color={colors.copper} strokeWidth={2.2} />
              </IconBadge>
              <View style={styles.stepHeaderText}>
                <Text style={styles.stepEyebrow}>STEP 1</Text>
                <Text style={styles.stepTitle}>Select your project type</Text>
              </View>
            </View>

            <View style={styles.serviceGrid}>
              {services.map((service) => {
                const Icon = service.icon;
                const selected = selectedService === service.title;
                return (
                  <Pressable
                    key={service.title}
                    onPress={() => setSelectedService(service.title)}
                    style={({ pressed }) => [
                      styles.serviceOption,
                      selected && styles.serviceOptionSelected,
                      pressed && { opacity: 0.95 },
                    ]}
                  >
                    <View
                      style={[
                        styles.serviceIconWrap,
                        selected && styles.serviceIconWrapSelected,
                      ]}
                    >
                      <Icon
                        size={20}
                        color={selected ? colors.white : colors.copper}
                        strokeWidth={2.2}
                      />
                    </View>
                    <Text style={styles.serviceOptionTitle}>{service.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          <Card padding={22}>
            <View style={styles.stepHeader}>
              <IconBadge size={44}>
                <User size={20} color={colors.copper} strokeWidth={2.2} />
              </IconBadge>
              <View style={styles.stepHeaderText}>
                <Text style={styles.stepEyebrow}>STEP 2</Text>
                <Text style={styles.stepTitle}>Homeowner details</Text>
              </View>
            </View>

            <Field
              label="Full name"
              required
              value={form.fullName}
              onChangeText={(value) => update('fullName', value)}
              placeholder="Enter your full name"
              error={showValidation && errors.fullName ? 'Full name is required.' : undefined}
              autoComplete="name"
            />

            <Field
              label="Email address"
              required
              value={form.email}
              onChangeText={(value) => update('email', value)}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={
                showValidation && errors.email
                  ? 'Enter a valid email address.'
                  : undefined
              }
            />

            <Field
              label="Phone number"
              required
              value={formatPhone(form.phone)}
              onChangeText={(value) =>
                update('phone', value.replace(/\D/g, '').slice(0, 10))
              }
              placeholder="(555) 555-5555"
              keyboardType="phone-pad"
              autoComplete="tel"
              error={
                showValidation && errors.phone
                  ? 'Enter a valid 10-digit U.S. phone number.'
                  : undefined
              }
            />
          </Card>

          <Card padding={22}>
            <View style={styles.stepHeader}>
              <IconBadge size={44}>
                <HomeIcon size={20} color={colors.copper} strokeWidth={2.2} />
              </IconBadge>
              <View style={styles.stepHeaderText}>
                <Text style={styles.stepEyebrow}>STEP 3</Text>
                <Text style={styles.stepTitle}>Property details</Text>
              </View>
            </View>

            <Field
              label="Property address"
              required
              value={form.address}
              onChangeText={(value) => update('address', value)}
              placeholder="Street address"
              autoComplete="street-address"
              error={
                showValidation && errors.address
                  ? 'Property address is required.'
                  : undefined
              }
            />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Field
                  label="City"
                  required
                  value={form.city}
                  onChangeText={(value) => update('city', value)}
                  placeholder="City"
                  error={
                    showValidation && errors.city ? 'City is required.' : undefined
                  }
                />
              </View>
              <View style={styles.rowItem}>
                <Field
                  label="ZIP"
                  required
                  value={form.zipCode}
                  onChangeText={(value) =>
                    update('zipCode', value.replace(/\D/g, '').slice(0, 5))
                  }
                  placeholder="ZIP"
                  keyboardType="number-pad"
                  error={
                    showValidation && errors.zipCode
                      ? 'Enter a valid 5-digit ZIP code.'
                      : undefined
                  }
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Property type</Text>
              <View style={styles.choiceList}>
                {propertyTypes.map((option) => {
                  const selected = propertyType === option;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setPropertyType(option)}
                      style={({ pressed }) => [
                        styles.choice,
                        selected && styles.choiceSelected,
                        pressed && { opacity: 0.95 },
                      ]}
                    >
                      <CheckCircle2
                        size={16}
                        color={selected ? colors.copper : colors.stone}
                        strokeWidth={2.2}
                      />
                      <Text style={styles.choiceText}>{option}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Card>

          <Card padding={22}>
            <View style={styles.stepHeader}>
              <IconBadge size={44}>
                <MapPin size={20} color={colors.copper} strokeWidth={2.2} />
              </IconBadge>
              <View style={styles.stepHeaderText}>
                <Text style={styles.stepEyebrow}>STEP 4</Text>
                <Text style={styles.stepTitle}>Project timing</Text>
              </View>
            </View>

            <View style={styles.choiceList}>
              {projectGoals.map((option) => {
                const selected = selectedGoal === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setSelectedGoal(option)}
                    style={({ pressed }) => [
                      styles.choice,
                      selected && styles.choiceSelected,
                      pressed && { opacity: 0.95 },
                    ]}
                  >
                    <CheckCircle2
                      size={16}
                      color={selected ? colors.copper : colors.moss}
                      strokeWidth={2.2}
                    />
                    <Text style={styles.choiceText}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Additional notes</Text>
              <TextInput
                value={form.notes}
                onChangeText={(value) => update('notes', value)}
                placeholder="Anything you would like FuseHarbor to know."
                placeholderTextColor={colors.stoneSoft}
                multiline
                numberOfLines={5}
                style={[styles.input, styles.inputMultiline]}
              />
            </View>
          </Card>

          <Card tone="sand" padding={24}>
            <Text style={[typography.eyebrow, { color: colors.copper }]}>
              SUBMISSION SUMMARY
            </Text>
            <Text style={styles.summaryTitle}>{selectedService}</Text>
            <SummaryRow label="Goal" value={selectedGoal} />
            <SummaryRow label="Property" value={propertyType} />
            <SummaryRow
              label="Homeowner"
              value={form.fullName.trim() || 'Not provided yet'}
            />
            <SummaryRow
              label="Location"
              value={
                form.city.trim() || form.zipCode.trim()
                  ? `${form.city.trim() || 'City pending'}${
                      form.city.trim() && form.zipCode.trim() ? ', ' : ''
                    }${form.zipCode.trim() || 'ZIP pending'}`
                  : 'Not provided yet'
              }
            />

            <Button
              label="Submit quote request"
              variant="primary"
              fullWidth
              onPress={handleSubmit}
              style={{ marginTop: spacing.xl }}
            />
          </Card>

          <View style={{ height: spacing.huge }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?:
    | 'name'
    | 'email'
    | 'tel'
    | 'street-address'
    | 'postal-code'
    | 'off';
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
}: FieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={{ color: colors.copper }}> *</Text> : null}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.stoneSoft}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        style={[styles.input, error ? styles.inputError : null]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
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
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.display,
    color: colors.graphite,
  },
  body: {
    ...typography.body,
    color: colors.stone,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stepHeaderText: {
    flex: 1,
  },
  stepEyebrow: {
    ...typography.eyebrow,
    color: colors.copper,
  },
  stepTitle: {
    ...typography.h3,
    color: colors.graphite,
    marginTop: 4,
  },
  serviceGrid: {
    gap: spacing.md,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.linen,
    backgroundColor: colors.warmWhite,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  serviceOptionSelected: {
    borderColor: colors.copper,
    backgroundColor: colors.white,
  },
  serviceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIconWrapSelected: {
    backgroundColor: colors.copper,
  },
  serviceOptionTitle: {
    ...typography.bodyStrong,
    color: colors.graphite,
    flex: 1,
  },
  fieldBlock: {
    marginTop: spacing.lg,
  },
  label: {
    ...typography.smallStrong,
    color: colors.graphite,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.linen,
    backgroundColor: colors.warmWhite,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.graphite,
    fontFamily: typography.body.fontFamily,
    fontSize: 15,
  },
  inputError: {
    borderColor: colors.red,
    backgroundColor: '#fff',
  },
  inputMultiline: {
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  errorText: {
    ...typography.small,
    color: colors.red,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  choiceList: {
    gap: spacing.sm,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.linen,
    backgroundColor: colors.warmWhite,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  choiceSelected: {
    borderColor: colors.copper,
    backgroundColor: colors.white,
  },
  choiceText: {
    ...typography.bodyStrong,
    color: colors.graphite,
    flex: 1,
  },
  summaryTitle: {
    ...typography.h2,
    color: colors.graphite,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(222, 214, 203, 0.7)',
    gap: spacing.lg,
  },
  summaryLabel: {
    ...typography.smallStrong,
    color: colors.copper,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  summaryValue: {
    ...typography.small,
    color: colors.stone,
    flex: 1,
    textAlign: 'right',
  },
});
