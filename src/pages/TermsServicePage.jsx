import React from "react";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";
import { useNavigate } from "react-router-dom";

const TermsServicePage = () => {

    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleSupportNavigation = () => {
        navigate("/support");
    };

    return (
        <div className="bg-primary-dark text-primary-light flex flex-col min-h-screen font-roboto" >
            <HeaderComponent />
            <main className="flex-grow p-8 md:p-12" >
                <h1 className="text-h1 font-bold mb-6" >Terms of Service</h1 >
                <p className="text-body mb-4" >
                    Welcome to UrbanOasis! By accessing or using our services, you agree to comply with these terms.
                </p >
                <section className="mb-6" >
                    <h2 className="text-h2 font-medium mb-4" >User Responsibilities</h2 >
                    <p className="text-body" >
                        You are responsible for maintaining the confidentiality of your account information and ensuring
                        that your activities on our platform comply with applicable laws.
                    </p >
                </section >
                <section className="mb-6" >
                    <h2 className="text-h2 font-medium mb-4" >Prohibited Activities</h2 >
                    <ul className="list-disc list-inside text-body" >
                        <li >Unauthorized access or use of our platform.</li >
                        <li >Sharing false or misleading information.</li >
                        <li >Engaging in activities that disrupt our services.</li >
                    </ul >
                </section >
                <section className="mb-6" >
                    <h2 className="text-h2 font-medium mb-4" >Limitation of Liability</h2 >
                    <p className="text-body" >
                        UrbanOasis is not liable for any direct, indirect, or incidental damages resulting from your use
                        of our platform.
                    </p >
                </section >
                <button onClick={handleSupportNavigation}
                        className="mt-4 bg-accent-purple text-primary-light py-2 px-4 rounded-md hover:bg-accent-blue transition" >
                    Contact Support
                </button >
            </main >
            <FooterComponent className="mt-auto" />
        </div >
    );
};

export default TermsServicePage;
