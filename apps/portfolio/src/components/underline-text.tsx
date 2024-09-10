type UnderlineTextProps = {
  children: React.ReactNode;
};

export default function UnderlineText({ children }: UnderlineTextProps) {
  return <span className="decoration-primary inline-block">{children}</span>;
}
