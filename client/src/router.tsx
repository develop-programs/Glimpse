import { createBrowserRouter } from "react-router";
import App from "./pages/App";
import { Suspense } from "react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>,
  },
]);
