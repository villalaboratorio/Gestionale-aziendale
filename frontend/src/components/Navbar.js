import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaFlask, FaIndustry, FaBookmark, FaMagic, FaCogs } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: FaHome, label: 'Home' },
        { path: '/ricette', icon: FaBook, label: 'Ricette' },
        { path: '/materie-prime', icon: FaFlask, label: 'Materie Prime' },
        { path: '/pianificazione-lavorazioni', icon: FaMagic, label: 'Pianificazione' },
        // Aggiorniamo il percorso per la nuova dashboard
        { path: '/dashboard-lavorazioni', icon: FaIndustry, label: 'Lavorazioni' },
        { path: '/pannello-opzioni', icon: FaCogs, label: 'Utility' },
        { path: '/styleguide', icon: FaBookmark, label: 'Stile' }
    ];

    return (
        <nav className="slim-navbar">
            <div className="nav-items">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <Link 
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            title={item.label}
                        >
                            <Icon className="nav-icon" />
                            <div className="tooltip">{item.label}</div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
