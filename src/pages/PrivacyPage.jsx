import React, {useEffect, useState} from "react";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import themeManager from "../utils/themeManager.jsx";

const PrivacyPage = () => {
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    return (
        <div className={`${darkMode ? "bg-primary-dark text-primary-light" : "bg-primary-light text-primary-dark"} flex flex-col min-h-screen font-roboto`}>
            <HeaderComponent />
            <main className="flex-grow p-8 md:p-12">
                <h1 className="text-h1 font-bold mb-6">Privacy and Cookie Policy</h1>
                <p className="text-body mb-4">
                    At UrbanOasis, we value your privacy and are committed to protecting your personal data. This page outlines our Privacy Policy and Cookie Policy, detailing how we collect, use, and safeguard your information.
                </p>

                <div>
                    <h2 className="text-h2 font-bold mb-6">Privacy Policy</h2>
                    <section className="mb-6">
                        <h3 className="text-h3 font-medium mb-4">Information We Collect</h3>
                        <p className="text-body">
                            We collect personal data you provide, such as your name, email address, and phone number. We may also collect data about your device, browser, and interaction with our platform.
                        </p>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-h3 font-medium mb-4">How We Use Your Information</h3>
                        <p className="text-body">
                            Your information is used to improve our services, process transactions, and provide customer support. We may also use your data to send you promotional content, which you can opt out of at any time.
                        </p>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-h3 font-medium mb-4">Data Security</h3>
                        <p className="text-body">
                            We implement robust security measures to protect your data. However, no online platform can guarantee absolute security.
                        </p>
                    </section>
                </div>

                <section>
                    <h2 className="text-h2 font-bold">Cookie Policy</h2>
                    <p className="text-body mb-4">
                        UrbanOasis uses cookies to enhance your experience and analyze website traffic. By using our platform, you consent to the use of cookies.
                    </p>
                    <section className="mb-6">
                        <h3 className="text-h3 font-medium mb-4">What Are Cookies?</h3>
                        <p className="text-body">
                            Cookies are small data files stored on your device to help websites remember your preferences and activities.
                        </p>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-h3 font-medium mb-4">Types of Cookies We Use</h3>
                        <ul className="list-disc list-inside text-body">
                            <li>Essential Cookies: Necessary for the website to function.</li>
                            <li>Analytics Cookies: Help us understand how you use our platform.</li>
                            <li>Marketing Cookies: Used for targeted advertising.</li>
                        </ul>
                    </section>
                </section>
            </main>
            <FooterComponent className="mt-auto" />
        </div>
    );
};

export default PrivacyPage;
