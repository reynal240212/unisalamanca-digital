import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, X, Home, User, Shield, LogIn } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const menuItems = [
        { name: 'Inicio', icon: <Home size={18} />, path: '/' },
        { name: 'Activar Carnet', icon: <LogIn size={18} />, path: '/login' },
        { name: 'Validador QR', icon: <Shield size={18} />, path: '/validator' },
    ];

    return (
        <header className="official-header">
            <div className="header-container">
                <div className="branding" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/images/escudo.png" alt="UniSalamanca" style={{ height: '40px' }} />
                    <span className="branding-text" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                        <span className="siau-acronym" title="Sistema Integral de Administración Universitaria" style={{ fontSize: '1.4rem', letterSpacing: '1px', cursor: 'help' }}>
                            <span className="si">SI</span><span className="au">AU</span>
                        </span>
                        <span style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, opacity: 0.8 }}>UniSalamanca</span>
                    </span>
                </div>

                <div className={`search-bar-container ${isSearchOpen ? 'active' : ''}`}>
                    <input type="text" placeholder="Buscar servicios, trámites..." className="header-search-input" />
                    <button className="search-close" onClick={() => setIsSearchOpen(false)}><X size={18} /></button>
                </div>

                <div className="header-links-desktop">
                    <a href="https://www.office.com/" target="_blank" className="nav-service-link">Correo</a>
                    <a href="#" className="nav-service-link">SIAU</a>
                    <span onClick={() => navigate('/biblioteca')} className="nav-service-link" style={{ cursor: 'pointer' }}>Biblioteca</span>
                </div>

                <div className="header-actions">
                    <div className="search-circle" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                        <Search size={18} />
                    </div>
                    <div className={`menu-circle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="mobile-menu-dropdown">
                        {menuItems.map((item, index) => (
                            <div 
                                key={index} 
                                className="menu-dropdown-item"
                                onClick={() => {
                                    navigate(item.path);
                                    setIsMenuOpen(false);
                                }}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
