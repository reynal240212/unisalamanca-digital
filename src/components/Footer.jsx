import React from 'react';
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="footer-modern-premium">
            <div className="footer-content-wrapper">
                <div className="footer-grid-premium">
                    {/* Brand Column */}
                    <div className="footer-col-main">
                        <div className="logo-concept inverse" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '1px' }}>
                                <span className="part-cyan">SI</span><span className="part-white">AU</span>
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                UniSalamanca <span style={{ color: 'var(--secondary)' }}>Digital</span>
                            </span>
                        </div>
                        <p className="footer-mission-text">
                            Transformamos vidas a través de una educación innovadora, humana y empresarial. Comprometidos con la excelencia académica y el desarrollo integral en la región Caribe.
                        </p>
                        <div className="footer-social-premium">
                            {[
                                { icon: <Facebook size={18} />, url: 'https://www.facebook.com/Unisalamancaa/' },
                                { icon: <Instagram size={18} />, url: 'https://www.instagram.com/unisalamanca' },
                                { icon: <Linkedin size={18} />, url: 'https://linkedin.com/school/unisalamanca' }
                            ].map((social, i) => (
                                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="social-pill-footer">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col-nav">
                        <h4 className="footer-col-title">Institucional</h4>
                        <ul className="footer-links-list">
                            <li onClick={() => navigate('/')}>Inicio</li>
                            <li onClick={() => navigate('/programas')}>Programas Académicos</li>
                            <li onClick={() => window.location.href = '#admisiones'}>Proceso de Admisiones</li>
                            <li onClick={() => window.location.href = '#institucional'}>Nuestra Institución</li>
                            <li onClick={() => navigate('/biblioteca')}>Biblioteca Digital</li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="footer-col-nav">
                        <h4 className="footer-col-title">Recursos</h4>
                        <ul className="footer-links-list">
                            <li onClick={() => navigate('/login')}>Portal de Estudiantes</li>
                            <li onClick={() => navigate('/login')}>Portal de Docentes</li>
                            <li onClick={() => window.open('https://www.office.com/', '_blank')}>Correo Institucional</li>
                            <li onClick={() => navigate('/validator')}>Validador de Títulos</li>
                            <li onClick={() => navigate('/policy')}>Protección de Datos</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-col-contact-premium">
                        <h4 className="footer-col-title">Contacto Directo</h4>
                        <div className="contact-item-premium">
                            <div className="contact-icon-footer"><MapPin size={18} /></div>
                            <div>
                                <p className="contact-label">Sede Principal</p>
                                <a href="https://maps.google.com/?q=Carrera+50+%2379+-+155,+Barranquilla" target="_blank" rel="noopener noreferrer" className="contact-value">
                                    Carrera 50 #79 - 155, Barranquilla
                                </a>
                            </div>
                        </div>
                        <div className="contact-item-premium">
                            <div className="contact-icon-footer"><Phone size={18} /></div>
                            <div>
                                <p className="contact-label">Línea de Atención</p>
                                <a href="tel:+576053606585" className="contact-value">+57 (605) 360 6585</a>
                            </div>
                        </div>
                        <div className="contact-item-premium">
                            <div className="contact-icon-footer"><Mail size={18} /></div>
                            <div>
                                <p className="contact-label">Correo Electrónico</p>
                                <a href="mailto:admisiones@unisalamanca.edu.co" className="contact-value">admisiones@unisalamanca.edu.co</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom-premium">
                    <div className="footer-bottom-flex">
                        <p className="copyright-text">
                            © {new Date().getFullYear()} UniSalamanca - Corporación Universitaria Empresarial de Salamanca. NIT: 802.011.011-1.
                        </p>
                        <div className="footer-legal-links">
                            <span>SNIES: 9114</span>
                            <span className="legal-dot"></span>
                            <span>Sujeta a inspección y vigilancia por MEN</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
