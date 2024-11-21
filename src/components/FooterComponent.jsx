import React from 'react';
import { Link } from "react-router-dom";

function FooterComponent() {
    return (
        <footer className="bg-primary-dark text-primary-light py-6">
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm">
                    © 2024 Urban Oasis. All rights reserved.
                </p>
                <nav className="flex space-x-4 text-sm mt-4 md:mt-0">
                    <Link to="/about" className="transition duration-300">
                        About
                    </Link>
                    <Link to="/support" className="transition duration-300">
                        Support
                    </Link>
                    <a href="#" className="transition duration-300">
                        Privacy Policy
                    </a>
                    <a href="#" className="transition duration-300">
                        Terms of Service
                    </a>
                </nav>
            </div>
        </footer>
    );
}

export default FooterComponent;
