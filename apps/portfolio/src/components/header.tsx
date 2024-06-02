type HeaderProps = {
  children: React.ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <div className="medium-up large container sticky top-0 z-[100] print:hidden">
      <header
        className="border-1 bg-warm-black border-layout flex h-[64px] w-full flex-col items-center justify-between
          rounded-b-2xl border border-t-0 px-8 py-4 hover:border-rose-300 md:flex-row lg:px-20 lg:py-8"
      >
        {children}
      </header>
    </div>
  );
}
