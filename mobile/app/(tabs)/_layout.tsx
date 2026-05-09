import { Tabs } from 'expo-router';
import { FileText, Home, Layers, Sparkles } from 'lucide-react-native';
import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.copper,
        tabBarInactiveTintColor: colors.stone,
        tabBarLabelStyle: styles.label,
        tabBarStyle: [styles.bar, Platform.OS === 'ios' ? styles.barIOS : styles.barAndroid],
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size - 2} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => (
            <Layers color={color} size={size - 2} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="how"
        options={{
          title: 'How',
          tabBarIcon: ({ color, size }) => (
            <Sparkles color={color} size={size - 2} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="quote"
        options={{
          title: 'Quote',
          tabBarIcon: ({ color, size }) => (
            <FileText color={color} size={size - 2} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.white,
    borderTopColor: colors.linen,
    paddingTop: 6,
  },
  barIOS: {
    height: 84,
  },
  barAndroid: {
    height: 64,
    paddingBottom: 8,
  },
  label: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 11,
    letterSpacing: 0.3,
    marginTop: 2,
  },
});
