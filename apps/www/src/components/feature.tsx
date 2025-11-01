type FeatureProps = {
  flag?: 'enable' | 'disable';
  children: React.ReactNode;
};

export default function Feature({ flag, children }: FeatureProps) {
  if (flag === 'enable') {
    return <>{children}</>;
  }

  return null;
}
