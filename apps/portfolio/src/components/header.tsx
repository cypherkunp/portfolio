type HeaderProps = {
  children: React.ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <header
      className="border-1 bg-warm-black border-layout flex h-[92px] w-full flex-col items-center justify-between
        rounded-b-2xl border border-t-0 px-8 py-4 hover:border-rose-300 md:flex-row lg:px-20 lg:py-8"
    >
      {children}
    </header>
  );
}
