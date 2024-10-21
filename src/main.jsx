import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import './index.css';
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import NotFound from "./pages/404NotFound.jsx";

import UserProfilePage from "./pages/UserProfilePage.jsx";
import ContactInfoPage from './pages/ContactInfoPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import SupportPage from './pages/SupportPage.jsx';
import UserProfileContent from './components/UserProfileContent.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PhotoCarousel from "./components/PhotoCarousel.jsx";
import EventPage from "./pages/EventPage.jsx";
import EventCreationPage from "./pages/EventCreationPage.jsx";
import HostSignUpPage from "./pages/HostSignUpPage.jsx";
import ViewAllEventsPage from "./pages/ViewAllEventsPage.jsx";
import HostDashboard from "./pages/HostDashboard.jsx";
import HostEventPage from "./pages/HostEventPage.jsx";
import HostChatList from "./pages/HostChatListPage.jsx";
import ChatPage from './pages/ChatPage.jsx';
import HostProfilePage from "./pages/HostProfilePage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/eventPage/:eventId",
        element: <EventPage />
    },
    {
        path: "/hostEventPage/:eventId",
        element: <HostEventPage />
    },
    {
        path: "/eventCreation",
        element: <EventCreationPage />
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
        path: "/userProfilePage",
        element: <UserProfilePage />,
        children: [
            {index: true, element: <UserProfileContent />},
            {path: "contact-info", element: <ContactInfoPage />},
            {path: "settings", element: <SettingsPage />},
            {path: "support", element: <SupportPage />},
            {path: "host-signup", element: <HostSignUpPage />},
            {path: "host-chatlist", element: <HostChatList />}
        ]
    },
    {
        path: "/hostProfilePage",
        element: <HostDashboard />,
    },
    {
        path: "/photoCarousel",
        element: <PhotoCarousel />
    },
    {
        path: "/events",
        element: <ViewAllEventsPage />
    },
    {
        path: "/chat/:chatId",
        element: <ChatPage />
    },
    {
        path: "/hostReviewPage",
        element: <HostProfilePage />
    },
    {
        path: "*",
        element: <NotFound />
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode >
        <RouterProvider router={router} />
    </StrictMode >
);
