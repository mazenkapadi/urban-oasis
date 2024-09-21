import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import NotFound from "./pages/404NotFound.jsx";
import UserPage from "./pages/UserProfile.jsx";
import EventPage from "./pages/EventPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/signIn",
        element: <SignInPage />
    },
    {
        path: "/signUp",
        element: <SignUpPage />
    },
    {
        path: "/forgotPassword",
        element: <ForgotPasswordPage />
    },
    {
        path: "/userPage",
        element: <UserPage />
    },
    {
        path: "/eventPage",
        element: <EventPage />
    },
    {
        path: "*",
        element: <NotFound />
    },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
