import { Outlet, RootRoute, Route, Router } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import Room from './components/Room';
import Home from './components/Home';

export const rootRoute = new RootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

export const roomRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/$roomName',
  component: Room,
});

export const routeTree = rootRoute.addChildren([homeRoute, roomRoute]);

export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
