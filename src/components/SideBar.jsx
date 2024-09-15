import React from 'react';
import { BiHome, BiBookAlt, BiTask, BiCreditCard, BiCog, BiSupport } from 'react-icons/bi';
import "../styles/sidebar.css";

const Sidebar = () => {
    return (
        <div className="menu">
            <div className="logo">
                <BiBookAlt className="logo-icon" />
                <h2>UrbanOasis</h2>
            </div>

            <div className="menu--list">
                <a href="#" className="item">
                    <BiHome className="icon" />
                    Profile
                </a>
                <a href="#" className="item">
                    <BiTask className="icon" />
                    Contact Info
                </a>
                <a href="#" className="item">
                    <BiCreditCard className="icon" />
                    Payments
                </a>
                <a href="#" className="item">
                    <BiCog className="icon" />
                    Settings
                </a>
                <a href="#" className="item">
                    <BiSupport className="icon" />
                    Support
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
