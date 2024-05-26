export default function Footer() {
  return (
    <footer
      className="border-1 bg-warm-black shadow-top border-layout relative z-[1] flex h-[48px] w-full flex-col
        items-center justify-center rounded-t-2xl border border-b-0 px-16 py-8 shadow-slate-300 md:flex-row
        md:justify-between lg:px-20"
    >
      <div className="flex gap-4">
        <p className="text-silver text-2xl">
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-fluorescent-green">Devvrat™</span>
        </p>
      </div>
      <div className="flex w-11 gap-4"></div>
    </footer>
  );
}
