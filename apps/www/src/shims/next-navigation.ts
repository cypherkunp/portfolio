import { useRouterState, useRouter as useTanStackRouter } from '@tanstack/react-router';

export function usePathname() {
  return useRouterState({ select: state => state.location.pathname });
}

export function useRouter() {
  const router = useTanStackRouter();
  return {
    back() {
      router.history.back();
    },
    push(href: string) {
      window.location.assign(href);
    },
    replace(href: string) {
      window.location.replace(href);
    },
  };
}

export function notFound(): never {
  throw new Error('NEXT_NOT_FOUND');
}

export function redirect(url: string) {
  return Response.redirect(url);
}
