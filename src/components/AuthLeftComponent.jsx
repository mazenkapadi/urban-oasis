import {
    CalendarDaysIcon,
    UserGroupIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline'
import {useEffect, useState} from "react";
import themeManager from "../utils/themeManager.jsx";

function AuthLeftComponent() {
    const [ darkMode, setDarkMode ] = useState(themeManager.isDarkMode);

    useEffect(() => {
        const handleThemeChange = (isDark) => setDarkMode(isDark);
        themeManager.addListener(handleThemeChange);

        return () => {
            themeManager.removeListener(handleThemeChange);
        };
    }, []);

    return (
        <div className={`flex w-full items-center justify-center h-screen p-8 ${darkMode ? "bg-primary-dark" : "bg-Light-L1"}`} >
            <div className="leftColumn w-full max-w-lg p-8" >
                <h2 className={`text-4xl mb-8 font-archivo ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Urban Oasis</h2 >
                <div className="flex items-start mb-6" >
                    <CalendarDaysIcon className={`h-6 w-6 mr-4 mt-1 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} />
                    <div >
                        <h4 className={`text-lg font-semibold mb-2 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Connect Your Community</h4 >
                        <p className={`${darkMode ? "text-Light-L3" : "text-Dark-D2"}`} >Discover local events and connect with your neighbors</p >
                    </div >
                </div >

                <div className="flex items-start mb-6" >
                    <UserGroupIcon className={`h-6 w-6 mr-4 mt-1 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} />
                    <div >
                        <h4 className={`text-lg font-semibold mb-2 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Ease of Use</h4 >
                        <p className={`${darkMode ? "text-Light-L3" : "text-Dark-D2"}`} >Effortless event creation and seamless registration</p >
                    </div >
                </div >

                <div className="flex items-start mb-6" >
                    <PresentationChartLineIcon className={`h-6 w-6 mr-4 mt-1 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} />
                    <div >
                        <h4 className={`text-lg font-semibold mb-2 ${darkMode ? "text-primary-light" : "text-primary-dark"}`} >Flexibility</h4 >
                        <p className={`${darkMode ? "text-Light-L3" : "text-Dark-D2"}`} >From block parties to music festivals, we've got you covered</p >
                    </div >
                </div >
            </div >

        </div >
    );
}

export default AuthLeftComponent;