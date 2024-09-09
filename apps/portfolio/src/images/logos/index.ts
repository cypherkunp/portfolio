import Minimal from './minimal.svg';
import UnileverIcon from './unilever-logo.svg';
import PTCIcon from './ptc-logo.svg';
import PublicisSapientIcon from './publicis-sapient-logo.svg';
import LloydsBankIcon from './lloyds-bank-logo.svg';
import DGDAIcon from './dgda-logo';

export type CompanyName = 'unilever' | 'ptc' | 'publicis-sapient' | 'lloyds-bank' | 'dgda';

export type Icon = any;

export const getCompanyLogo = (name: CompanyName): Icon => {
  switch (name) {
    case 'unilever':
      return UnileverIcon;
    case 'ptc':
      return PTCIcon;
    case 'publicis-sapient':
      return PublicisSapientIcon;
    case 'lloyds-bank':
      return LloydsBankIcon;
    case 'dgda':
      return DGDAIcon;
    default:
      return Minimal;
  }
};

export { Minimal, UnileverIcon, PTCIcon, PublicisSapientIcon, LloydsBankIcon, DGDAIcon };
