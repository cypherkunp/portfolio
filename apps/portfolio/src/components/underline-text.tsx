type UnderlineTextProps = {
  children: React.ReactNode;
};

export default function UnderlineText({ children }: UnderlineTextProps) {
  return (
    <span className="inline-block underline decoration-rose-400 underline-offset-[12px]">
      {children}
    </span>
  );
}
