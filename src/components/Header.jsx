import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="official-header">
            <div className="header-container">
                <div className="branding" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/images/escudo.png" alt="UniSalamanca" style={{ height: '40px' }} />
                    <span style={{ fontWeight: 900, letterSpacing: '0.5px', fontSize: '1.2rem' }}>
                        <span style={{ color: 'var(--secondary)' }}>Uni</span><span style={{ color: 'var(--primary)' }}>Salamanca</span>
                    </span>
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
