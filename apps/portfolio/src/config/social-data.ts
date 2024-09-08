import { GithubIcon, LinkedinIcon, XIcon } from 'lucide-react';

type SocialIcon = React.FC | null;

export const SOCIAL_ICONS = {
  GitHub: {
    icon: GithubIcon,
  },
  LinkedIn: {
    icon: LinkedinIcon,
  },
  X: {
    icon: XIcon,
  },
};

export function getSocialLink(name: 'GitHub' | 'LinkedIn' | 'X'): SocialIcon {
  return SOCIAL_ICONS[name].icon;
}
