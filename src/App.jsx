import React from 'react';
import Sidebar from './components/Sidebar';
import Content from "./components/Content.jsx";
import Profile from "./components/Profile.jsx";
import './App.css';

const App = () => {
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="dashboard--content">
                <Content/>
                <Profile/>
            </div>
        </div>
    );
};
export default App;