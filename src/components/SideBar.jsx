import React from 'react';
import {BiHome, BiTask, BiCreditCard, BiCog, BiSupport, BiBookAlt} from 'react-icons/bi';


const Sidebar = () => {
    return (
        <>
            <div className="menu">
                {/* Logo Section */}
                <div className="logo">
                    <BiBookAlt className="logo-icon"/>
                    <h2>UrbanOasis</h2>
                </div>

                {/* Menu List */}
                <div className="menu--list">
                    <a href="#" className="item">
                        <BiHome className="icon"/>
                        ProfileContent
                    </a>
                    <a href="#" className="item">
                        <BiTask className="icon"/>
                        Contact Info
                    </a>
                    <a href="#" className="item">
                        <BiCreditCard className="icon"/>
                        Payments
                    </a>
                    <a href="#" className="item">
                        <BiCog className="icon"/>
                        Settings
                    </a>
                    <a href="#" className="item">
                        <BiSupport className="icon"/>
                        Support
                    </a>
                </div>
            </div>
        </>
    );
};

export default Sidebar;


