import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-warm-white -full my-auto flex flex-col items-center justify-center gap-4">
      <h1 className="text-9xl font-bold ">404</h1>
      <p className=" text-xl">
        Oops! Looks like you've wandered off the map. You must return{' '}
        <Link className="text-fluorescent-green underline underline-offset-4" href="/">
          home
        </Link>
        !
      </p>
    </div>
  );
}
