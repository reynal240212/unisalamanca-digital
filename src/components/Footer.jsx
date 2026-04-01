import React from 'react';
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="official-footer">
            <div className="footer-top-official">
                <div className="footer-col-brand">
                    <div className="logo-concept inverse">
                        <span className="part-cyan">Uni</span>
                        <span className="part-white">Salamanca</span>
                    </div>
                    <p className="footer-description">
                        Institución de educación superior sujeta a inspección y vigilancia por el Ministerio de Educación Nacional.
                    </p>
                    <div className="social-links">
                        <a href="https://www.facebook.com/Unisalamancaa/" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Facebook size={20} />
                        </a>
                        <a href="https://www.instagram.com/unisalamanca" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Instagram size={20} />
                        </a>
                        <a href="https://linkedin.com/school/unisalamanca" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>
                <div className="footer-col-links">
                    <h4>NAVEGACIÓN</h4>
                    <ul>
                        <li onClick={() => navigate('/')}>Inicio</li>
                        <li onClick={() => navigate('/login')}>Activar Carnet</li>
                        <li onClick={() => navigate('/login')}>Mi Identidad Digital</li>
                        <li onClick={() => navigate('/validator')}>Verificador QR</li>
                    </ul>
                </div>
                <div className="footer-col-contact">
                    <h4>SEDE BARRANQUILLA</h4>
                    <p>
                        <MapPin size={16} /> 
                        <a href="https://maps.apple.com/?address=Carrera%2050%20%2379-155,%20Barranquilla,%20Colombia" target="_blank" rel="noopener noreferrer" className="contact-link">
                            Carrera 50 #79 - 155, Barranquilla
                        </a>
                    </p>
                    <p>
                        <Phone size={16} /> 
                        <a href="tel:+576053606585" className="contact-link">+57 (605) 360 6585</a>
                    </p>
                    <p>
                        <Phone size={16} /> 
                        <a href="tel:+573208345051" className="contact-link">+57 320 834 5051 (Admisiones)</a>
                    </p>
                    <p>
                        <Mail size={16} /> 
                        <a href="mailto:admisiones@unisalamanca.edu.co" className="contact-link">admisiones@unisalamanca.edu.co</a>
                    </p>
                </div>
            </div>
            <div className="footer-bottom-official">
                <p>© 2026 CORPORACIÓN UNIVERSITARIA EMPRESARIAL DE SALAMANCA (CUES). NIT: 802.011.011-1. TODOS LOS DERECHOS RESERVADOS.</p>
            </div>
        </footer>
    );
};

export default Footer;
