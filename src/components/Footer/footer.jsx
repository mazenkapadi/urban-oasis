// import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-wrap -mx-6">
          {/* Column 1 */}
          <div className="w-full md:w-1/3 px-6 mb-6 md:mb-0">
            <h5 className="uppercase mb-4 font-bold">Company</h5>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Blog
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="w-full md:w-1/3 px-6 mb-6 md:mb-0">
            <h5 className="uppercase mb-4 font-bold">Explore</h5>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Events
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Venues
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Organizers
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="w-full md:w-1/3 px-6 mb-6 md:mb-0">
            <h5 className="uppercase mb-4 font-bold">Follow Us</h5>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-400">
                  Facebook
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-400">
                  Twitter
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-400">
                  Instagram
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-400">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">
              © 2024 Your Company. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
