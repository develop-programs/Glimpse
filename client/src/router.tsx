import { createBrowserRouter } from "react-router";
import { Suspense } from "react";
import { lazy } from "react";
import Loading from "./pages/Loading";

const App = lazy(() => import("./pages/App"));
const Pricing = lazy(() => import("./pages/pricing/Pricing"));
const NotFound = lazy(() => import("./pages/404-error"));
const DashboardPage = lazy(() => import("./pages/Dashboard/Dashboard"));

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
      <div></div>
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
  }
]);
