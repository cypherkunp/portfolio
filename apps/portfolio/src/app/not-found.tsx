import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-warm-white my-auto flex w-full items-center justify-center">
      <div className="flex flex-col text-center">
        <h1 className="text-9xl font-bold md:text-[256px]">
          <span className="relative inline-block">
            <span className="text-fluorescent-green relative ">404</span>
          </span>
        </h1>

        <div className="mt-1 flex items-center justify-center">
          <p className="text-2xl italic">
            Oops! Looks like you've wandered off the map. You must return{' '}
            <Link className="text-fluorescent-green underline underline-offset-4" href="/">
              home
            </Link>
            !
          </p>
        </div>
      </div>
    </div>
  );
}
