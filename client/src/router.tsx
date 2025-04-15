import { createBrowserRouter } from "react-router";
import { Suspense } from "react";
import { lazy } from "react";

const App = lazy(() => import("@/pages/App"));
const Pricing = lazy(() => import("@/pages/pricing/Pricing"));
const NotFound = lazy(() => import("@/pages/404-error"));
const DashboardPage = lazy(() => import("@/pages/Dashboard/Dashboard"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Loading = lazy(() => import("@/pages/Loading"));
const Room = lazy(() => import("@/pages/room/room"));
const Feature = lazy(() => import("@/pages/Feature"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<Loading />}>
      <App />
    </Suspense>,
  },
  {
    path: "/*",
    element: <Suspense fallback={<Loading />}>
      <NotFound />
    </Suspense>,
  },
  {
    path: "/room/:roomId",
    element: <Suspense fallback={<Loading />}>
      <Room />
    </Suspense>,
  },
  {
    path: "/pricing",
    element: <Suspense fallback={<Loading />}>
      <Pricing />
    </Suspense>,
  },
  {
    path: "/Dashboard",
    element: <Suspense fallback={<Loading />}>
      <DashboardPage />
    </Suspense>,
  },
  {
    path: "/auth/login",
    element: <Suspense fallback={<Loading />}>
      <Login />
    </Suspense>,
  },
  {
    path: "/features",
    element: <Suspense fallback={<Loading />}>
      <Feature />
    </Suspense>,
  }
]);
