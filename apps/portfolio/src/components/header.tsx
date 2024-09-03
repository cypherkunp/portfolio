import { Navbar } from './navbar';

export default function Header() {
  return (
    <div className="sticky top-0 z-[100] flex justify-center bg-inherit print:hidden">
      <header
        className="border-layout flex h-[80px] w-full flex-col items-start justify-between py-2 hover:border-rose-300
          md:flex-row lg:py-8"
      >
        <Navbar />
      </header>
    </div>
  );
}
