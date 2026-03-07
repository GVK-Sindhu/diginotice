import React, { useState } from 'react';
import { Sidebar, Navbar } from './';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [searchHandler, setSearchHandler] = useState(null);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Navbar onSearch={searchHandler} />
                <div className="fade-in">
                    <Outlet context={{ setSearchHandler }} />
                </div>
            </div>
        </div>
    );
};

export default Layout;
