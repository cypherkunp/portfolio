type FeatureProps = {
  flag?: 'enable' | 'disable';
  children: React.ReactNode;
};

export default function Feature({ flag = 'disable', children }: FeatureProps) {
  if (flag === 'enable') {
    return <>{children}</>;
  }

  return null;
}
