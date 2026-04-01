import { flag } from 'flags/next';

export const featureAppsSupport = flag<boolean>({
  key: 'feature-apps-support',
  defaultValue: false,
  description: 'Controls visibility of the Apps section on the homepage',
  options: [
    { value: false, label: 'Hidden' },
    { value: true, label: 'Visible' },
  ],
  decide() {
    return process.env.FEATURE_APPS_SUPPORT === 'true';
  },
});
