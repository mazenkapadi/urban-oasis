import { useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div
            onClick={() => setDarkMode(!darkMode)}
            className={`relative flex items-center w-20 h-10 rounded-full cursor-pointer transition-colors duration-500  ${
                darkMode
                    ? "bg-primary-dark border-primary-light"
                    : "bg-primary-light border-primary-dark"
            } shadow-lg`}
        >
            <div
                className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-500 transform ${
                    darkMode
                        ? "translate-x-10 bg-primary-light"
                        : "translate-x-1 bg-primary-dark"
                } shadow-md`}
            >
                {darkMode ? (
                    <MoonIcon className="w-5 h-5 text-primary-dark" />
                ) : (
                    <SunIcon className="w-5 h-5 text-primary-light" />
                )}
            </div>
        </div>
    );
}
