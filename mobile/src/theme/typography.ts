import { Platform, TextStyle } from 'react-native';

export const fontFamily = {
  manropeRegular: 'Manrope_400Regular',
  manropeMedium: 'Manrope_500Medium',
  manropeSemiBold: 'Manrope_600SemiBold',
  manropeBold: 'Manrope_700Bold',
  interRegular: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
  interBold: 'Inter_700Bold',
} as const;

export const typography = {
  eyebrow: {
    fontFamily: fontFamily.interBold,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  } as TextStyle,
  display: {
    fontFamily: fontFamily.manropeSemiBold,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.8,
  } as TextStyle,
  h1: {
    fontFamily: fontFamily.manropeSemiBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
  } as TextStyle,
  h2: {
    fontFamily: fontFamily.manropeSemiBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  } as TextStyle,
  h3: {
    fontFamily: fontFamily.manropeSemiBold,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,
  body: {
    fontFamily: fontFamily.interRegular,
    fontSize: 15,
    lineHeight: 24,
  } as TextStyle,
  bodyStrong: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 15,
    lineHeight: 22,
  } as TextStyle,
  small: {
    fontFamily: fontFamily.interRegular,
    fontSize: 13,
    lineHeight: 20,
  } as TextStyle,
  smallStrong: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 13,
    lineHeight: 20,
  } as TextStyle,
  button: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 14,
    letterSpacing: 0.2,
  } as TextStyle,
} as const;

export const fontPlatformShadow = Platform.select({
  ios: {},
  android: {},
  default: {},
});
