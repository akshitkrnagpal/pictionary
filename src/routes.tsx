import { Outlet, RootRoute, Route, Router } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

// @ts-expect-error - no types yet
import Room from './components/Room';

export const rootRoute = new RootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

export const roomRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/$roomName',
  component: Room,
});

export const routeTree = rootRoute.addChildren([roomRoute]);

export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
