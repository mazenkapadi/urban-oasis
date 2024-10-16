import { useState, useEffect } from "react";
import LogoComponent from "./LogoComponent";
import ProfileOrSignIn from "./ProfileOrSignIn";
import MenuButton from "./MenuButton";
import DropdownMenu from "./DropdownMenu";
import SearchBarComponent from "./SearchBarComponent";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const HeaderComponent = () => {
    const [ menuOpen, setMenuOpen ] = useState(false);

    const [ isLoggedIn, setIsLoggedIn ] = useState(false);

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
            <div className="p-2 bg-transparent" >
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
        </>
    );
};

export default HeaderComponent;
