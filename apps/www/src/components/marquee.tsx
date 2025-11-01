export default function Marquee() {
  return (
    <div
      className="animate-marquee flex w-full flex-row whitespace-nowrap py-12 lg:py-20"
      style={{ animationPlayState: 'running' }}
    >
      <div className="group relative flex min-w-[50%] justify-center rounded-2xl px-5 lg:min-w-[25%]">
        <div
          className="relative h-auto rotate-2 overflow-hidden rounded-2xl transition-all duration-300 ease-in-out
            before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:bg-gradient-to-r
            before:from-transparent before:via-white/10 before:to-transparent group-hover:rotate-[-1deg]
            group-hover:scale-110 group-hover:shadow-lg group-hover:before:animate-[shimmer_1s_forwards]
            lg:group-hover:shadow-2xl"
        >
          <div className="border-1 border-layout size-44 bg-slate-100"></div>
        </div>
      </div>
      <div className="group relative flex min-w-[50%] justify-center rounded-2xl px-5 lg:min-w-[25%]">
        <div
          className="relative h-auto rotate-[-2deg] overflow-hidden rounded-2xl transition-all duration-300 ease-in-out
            before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:bg-gradient-to-r
            before:from-transparent before:via-white/10 before:to-transparent group-hover:rotate-1
            group-hover:scale-110 group-hover:shadow-lg group-hover:before:animate-[shimmer_1s_forwards]
            lg:group-hover:shadow-2xl"
        >
          <div className="border-1 border-layout size-44 bg-slate-100"></div>
        </div>
      </div>
      <div className="group relative flex min-w-[50%] justify-center rounded-2xl px-5 lg:min-w-[25%]">
        <div
          className="relative h-auto rotate-2 overflow-hidden rounded-2xl transition-all duration-300 ease-in-out
            before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:bg-gradient-to-r
            before:from-transparent before:via-white/10 before:to-transparent group-hover:rotate-[-1deg]
            group-hover:scale-110 group-hover:shadow-lg group-hover:before:animate-[shimmer_1s_forwards]
            lg:group-hover:shadow-2xl"
        >
          <div className="border-1 border-layout size-44 bg-slate-100"></div>
        </div>
      </div>
      <div className="group relative flex min-w-[50%] justify-center rounded-2xl px-5 lg:min-w-[25%]">
        <div
          className="relative h-auto rotate-2 overflow-hidden rounded-2xl transition-all duration-300 ease-in-out
            before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:bg-gradient-to-r
            before:from-transparent before:via-white/10 before:to-transparent group-hover:rotate-[-1deg]
            group-hover:scale-110 group-hover:shadow-lg group-hover:before:animate-[shimmer_1s_forwards]
            lg:group-hover:shadow-2xl"
        >
          <div className="border-1 border-layout size-44 bg-slate-100"></div>
        </div>
      </div>
      <div className="group relative flex min-w-[50%] justify-center rounded-2xl px-5 lg:min-w-[25%]">
        <div
          className="relative h-auto rotate-2 overflow-hidden rounded-2xl transition-all duration-300 ease-in-out
            before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:bg-gradient-to-r
            before:from-transparent before:via-white/10 before:to-transparent group-hover:rotate-[-1deg]
            group-hover:scale-110 group-hover:shadow-lg group-hover:before:animate-[shimmer_1s_forwards]
            lg:group-hover:shadow-2xl"
        >
          <div className="border-1 border-layout size-44 bg-slate-100"></div>
        </div>
      </div>
      <div className="group relative flex min-w-[50%] justify-center rounded-2xl px-5 lg:min-w-[25%]">
        <div
          className="relative h-auto rotate-2 overflow-hidden rounded-2xl transition-all duration-300 ease-in-out
            before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:bg-gradient-to-r
            before:from-transparent before:via-white/10 before:to-transparent group-hover:rotate-[-1deg]
            group-hover:scale-110 group-hover:shadow-lg group-hover:before:animate-[shimmer_1s_forwards]
            lg:group-hover:shadow-2xl"
        >
          <div className="border-1 border-layout size-44 bg-slate-100"></div>
        </div>
      </div>
    </div>
  );
}
