import { Icons } from '@/components/icons';

type SocialLink = {
  name: string;
  url: string;
  icon: React.FC | null;
};

export const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com/cypherkunp',
    icon: Icons.gitHub,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/devvratshukla/',
    icon: Icons.linkedin,
  },
  {
    name: 'X',
    url: 'https://twitter.com/cypherkunp',
    icon: Icons.x,
  },
];

export function getSocialLink(name: 'GitHub' | 'LinkedIn' | 'X'): SocialLink {
  return SOCIAL_LINKS.find(link => link.name === name) ?? { name: '', url: '', icon: null };
}
