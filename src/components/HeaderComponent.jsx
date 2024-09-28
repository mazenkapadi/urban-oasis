import { useState, useEffect } from "react";
import LogoComponent from "./LogoComponent";
import ProfileOrSignIn from "./ProfileOrSignIn";
import MenuButton from "./MenuButton";
import DropdownMenu from "./DropdownMenu";
import SearchBarComponent from "./SearchBarComponent";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const HeaderComponent = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
        return () => unsubscribe();
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-primary-dark p-2" >
                <div className="p-2" >
                    <div className="flex flex-col md:flex-row justify-between items-center" >
                        <LogoComponent />
                        <SearchBarComponent />
                        <div className="flex items-center space-x-4" >
                            <ProfileOrSignIn isLoggedIn={isLoggedIn} />
                            <MenuButton toggleMenu={toggleMenu} />
                        </div >
                    </div >
                </div >
                <DropdownMenu isOpen={menuOpen} />
            </div >
        </>
    );
};

export default HeaderComponent;
