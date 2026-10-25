type FontOptions = {
  subsets?: string[];
  display?: string;
  weight?: string | string[];
};

function font(className: string) {
  return function loadFont(_options?: FontOptions) {
    return {
      className,
      variable: `--${className}`,
      style: { fontFamily: className === 'font-geist-mono' ? "'Geist Mono Variable'" : 'Geist Variable' },
    };
  };
}

export const Geist = font('font-geist');
export const Geist_Mono = font('font-geist-mono');
