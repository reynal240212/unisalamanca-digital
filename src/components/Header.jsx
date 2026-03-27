import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="official-header">
            <div className="header-container">
                <div className="branding" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/images/logo-oficial.svg" alt="UniSalamanca" style={{ height: '50px' }} />
                </div>
                <div className="header-actions">
                    <div className="search-circle"><Search size={18} /></div>
                    <div className="menu-circle"><Menu size={18} /></div>
                </div>
            </div>
        </header>
    );
};

export default Header;
