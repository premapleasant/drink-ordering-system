import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Database, MessageSquare, Menu } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <div className="glass-icon"><Package size={24} /></div>
                <h1>SipSync AI</h1>
            </div>
            
            <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                <Menu />
            </button>

            <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                <li>
                    <NavLink to="/admin/products" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsOpen(false)}>
                        <Package size={18} /><span>Products</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/stock" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsOpen(false)}>
                        <Database size={18} /><span>Stock</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsOpen(false)}>
                        <MessageSquare size={18} /><span>Chatbot</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
