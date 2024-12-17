import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout, LoadingComponent, ProtectedRoute } from "lib";
import {
  COMPOSE_ROUTE,
  LANDING_PAGE_ROUTE,
  LOGIN_ROUTE,
  POSTS_ROUTE,
} from "constants/routes";

const Home = lazy(() => import("pages/home"));
const Login = lazy(() => import("pages/login"));
const Posts = lazy(() => import("pages/posts"));
const PostDetails = lazy(() => import("pages/posts/components/PostDetails"));
const Compose = lazy(() => import("pages/compose"));

function App() {
  const router = createBrowserRouter([
    {
      path: LANDING_PAGE_ROUTE,
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <Home />
        </Suspense>
      ),
    },
    {
      path: LANDING_PAGE_ROUTE,
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <Layout />
        </Suspense>
      ),
      children: [
        {
          path: POSTS_ROUTE,
          element: (
            <ProtectedRoute>
              <Suspense fallback={<LoadingComponent />}>
                <Posts />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: `${POSTS_ROUTE}/:postId`,
          element: (
            <ProtectedRoute>
              <Suspense fallback={<LoadingComponent />}>
                <PostDetails />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: COMPOSE_ROUTE,
          element: (
            <ProtectedRoute>
              <Suspense fallback={<LoadingComponent />}>
                <Compose />
              </Suspense>
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: LOGIN_ROUTE,
      element: (
        <Suspense fallback={<LoadingComponent />}>
          <Login />
        </Suspense>
      ),
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
