import React from 'react';

function FooterComponent() {
    return (
        <footer className="bg-primary-dark text-text-gray py-12">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-wrap -mx-6">
                    {/* Column 1 */}
                    <div className="w-full md:w-1/3 px-6 mb-6 md:mb-0">
                        <h5 className="uppercase mb-4 font-bold text-lg border-b border-gray-600 pb-2 text-primary-light">
                            Company
                        </h5>
                        <ul>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    About
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    Careers
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    Blog
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    Help Center
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="w-full md:w-1/3 px-6 mb-6 md:mb-0">
                        <h5 className="uppercase mb-4 font-bold text-lg border-b border-gray-600 pb-2 text-primary-light">
                            Explore
                        </h5>
                        <ul>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    Events
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    Venues
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    Organizers
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="w-full md:w-1/3 px-6 mb-6 md:mb-0">
                        <h5 className="uppercase mb-4 font-bold text-lg border-b border-gray-600 pb-2 text-primary-light">
                            Follow Us
                        </h5>
                        <ul>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    Facebook
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    Twitter
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    Instagram
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="hover:text-detail-orange transition duration-300">
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 border-t border-gray-700 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="mb-4 md:mb-0 text-sm">
                            © 2024 Your Company. All rights reserved.
                        </p>
                        <div className="flex space-x-4 text-sm">
                            <a href="#" className="hover:text-detail-orange transition duration-300">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-detail-orange transition duration-300">
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-detail-orange transition duration-300">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterComponent;
