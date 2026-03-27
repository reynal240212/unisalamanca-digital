import React from 'react';
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
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
                        <Facebook size={20} /> <Instagram size={20} /> <Linkedin size={20} />
                    </div>
                </div>
                <div className="footer-col-links">
                    <h4>NORMATIVIDAD</h4>
                    <ul>
                        <li>Política de Privacidad</li>
                        <li>Tratamiento de Datos</li>
                        <li>Estatutos</li>
                        <li>Reglamento Estudiantil</li>
                    </ul>
                </div>
                <div className="footer-col-contact">
                    <h4>UBICACIÓN</h4>
                    <p><MapPin size={16} /> Cra. 7 #45-21, Bogotá</p>
                    <p><Phone size={16} /> (601) 485 0000</p>
                    <p><Mail size={16} /> info@unisalamanca.edu.co</p>
                </div>
            </div>
            <div className="footer-bottom-official">
                <p>© 2026 CORPORACIÓN UNIVERSITARIA EMPRESARIAL DE SALAMANCA. TODOS LOS DERECHOS RESERVADOS.</p>
            </div>
        </footer>
    );
};

export default Footer;
