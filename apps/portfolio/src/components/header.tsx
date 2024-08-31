type HeaderProps = {
  children: React.ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <div className="sticky top-0 z-[100] flex justify-center bg-inherit print:hidden">
      <header
        className="border-layout m-5 flex h-[48px] w-full flex-col items-center justify-between px-2 py-2
          hover:border-rose-300 md:flex-row lg:py-8"
      >
        {children}
      </header>
    </div>
  );
}
