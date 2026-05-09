import {
  BatteryCharging,
  CarFront,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';

export type Service = {
  title: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: 'EV Charger Installation',
    description: 'Safe home charging setup with a premium homeowner experience.',
    longDescription:
      'Level 2 home charging done with care. We help homeowners plan placement, capacity, and a clean install that fits the way the home is actually used.',
    icon: CarFront,
  },
  {
    title: 'Panel Upgrades',
    description: 'Electrical capacity planning for higher home energy demand.',
    longDescription:
      'A modern panel is the foundation of an electrified home. FuseHarbor scopes the upgrade so future projects — EV, heat pump, battery — land on a panel that is ready.',
    icon: Zap,
  },
  {
    title: 'Heat Pump Solutions',
    description: 'Efficient comfort upgrades for future-ready homes.',
    longDescription:
      'Year-round comfort with lower operating cost. We help homeowners weigh options for whole-home heat pumps and ductless systems with realistic expectations.',
    icon: Sparkles,
  },
  {
    title: 'Battery & Backup Power',
    description: 'Resilience-minded energy storage and backup planning.',
    longDescription:
      'Backup power that fits real outage patterns. FuseHarbor helps homeowners think through what to back up, for how long, and what their panel and budget actually support.',
    icon: BatteryCharging,
  },
];
