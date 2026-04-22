import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    Search, 
    Globe, 
    Database, 
    ArrowUpRight,
    ExternalLink,
    Library
} from 'lucide-react';

const Biblioteca = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const institutionalResources = [
        { name: 'CloudLabs', description: 'Laboratorios virtuales de alta tecnología.', type: 'paid', url: 'https://platform.cloudlabslearning.com/' },
        { name: 'Cosechador', description: 'Buscador integrado de recursos bibliográficos.', type: 'paid', url: 'https://cosechador.bibliotecas-fit-unisalamanca.com/vufind/' },
        { name: 'Globallex.info', description: 'Base de datos jurídica internacional.', type: 'paid', url: 'https://unisalamanca.globallex.info' },
        { name: 'Koha', description: 'Sistema de gestión y catálogo de biblioteca.', type: 'paid', url: 'https://bibliotecas-fit-unisalamanca.com/' },
        { name: 'Leyex.info', description: 'Información legal y normativa de Colombia.', type: 'paid', url: 'https://unisalamanca.leyex.info' },
        { name: 'SENA', description: 'Bases de datos bibliográficas del SENA.', type: 'paid', url: 'https://biblioteca.sena.edu.co/paginas/bases.html' },
        { name: 'SGSST-Global.com', description: 'Recursos en Seguridad y Salud en el Trabajo.', type: 'paid', url: 'https://unisalamanca.sgsst-global.com' },
    ];

    const freeResources = [
        { name: 'DOAJ', description: 'Directorio de revistas de acceso abierto.', type: 'free', url: 'https://doaj.org/' },
        { name: 'Dialnet', description: 'Portal de difusión de la producción científica.', type: 'free', url: 'https://dialnet.unirioja.es/' },
        { name: 'CORE', description: 'La colección más grande del mundo de artículos de investigación de acceso abierto.', type: 'free', url: 'https://core.ac.uk/' },
        { name: 'REDALyC', description: 'Red de Revistas Científicas de América Latina y el Caribe, España y Portugal.', type: 'free', url: 'https://www.redalyc.org/' },
        { name: 'SciELO', description: 'Scientific Electronic Library Online.', type: 'free', url: 'https://scielo.org/' },
        { name: 'arXiv', description: 'Repositorio de pre-publicaciones científicas.', type: 'free', url: 'https://arxiv.org/' },
        { name: 'Google Scholar', description: 'Buscador de literatura académica.', type: 'free', url: 'https://scholar.google.com/' },
        { name: 'BASE', description: 'Bielefeld Academic Search Engine.', type: 'free', url: 'https://www.base-search.net/' },
        { name: 'ERIC', description: 'Education Resources Information Center.', type: 'free', url: 'https://eric.ed.gov/' },
    ];

    const filteredResources = [...institutionalResources, ...freeResources].filter(res => {
        const matchesFilter = filter === 'all' || (filter === 'paid' && res.type === 'paid') || (filter === 'free' && res.type === 'free');
        const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             res.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="official-presentation library-page">
            <Header />

            {/* Hero Section */}
            <div className="sub-header-bar">
                <div className="sub-header-content-premium">
                    <div className="sub-header-text">
                        <span className="id-badge-small">BIBLIOTECA VIRTUAL</span>
                        <h1 className="sub-header-title">Biblioteca Virtual <span className="siau-acronym"><span className="si">SI</span><span className="au">AU</span></span></h1>
                        <p className="sub-header-desc">
                            <b>Sistema Integral de Administración Universitaria</b> — Acceso directo a las bases de datos institucionales y recursos científicos globales de UniSalamanca.
                        </p>
                    </div>
                    <div className="sub-header-actions">
                        <div className="search-box-library">
                            <Search size={18} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Buscar en la biblioteca..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main className="library-container">
                {/* Filter Pills */}
                <div className="filter-tabs">
                    <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Todos los Recursos</button>
                    <button className={filter === 'paid' ? 'active' : ''} onClick={() => setFilter('paid')}>Bases de Datos Pagas</button>
                    <button className={filter === 'free' ? 'active' : ''} onClick={() => setFilter('free')}>Acceso Libre</button>
                </div>

                <section className="resources-grid">
                    {filteredResources.map((res, index) => (
                        <div key={index} className="resource-card-premium">
                            <div className={`res-icon ${res.type}`}>
                                {res.type === 'paid' ? <Database size={24} /> : <Globe size={24} />}
                            </div>
                            <div className="res-content">
                                <div className="res-type-badge">{res.type === 'paid' ? 'INSTITUCIONAL' : 'LIBRE'}</div>
                                <h3>{res.name}</h3>
                                <p>{res.description}</p>
                                <a href={res.url} target="_blank" rel="noopener noreferrer" className="btn-open-link">
                                    IR AL RECURSO <ArrowUpRight size={16} />
                                </a>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Info Banner */}
                <div className="mascot-info-banner">
                    <div className="mascot-img">
                        <img src="/images/ardilla.png" alt="Mascota" />
                    </div>
                    <div className="mascot-text">
                        <div className="badge-mascot">TIP DE INVESTIGACIÓN</div>
                        <h4>Optimiza tu búsqueda bibliográfica</h4>
                        <p>Utiliza los filtros de "Bases de Datos Pagas" para encontrar contenido exclusivo suscrito por la universidad para tu formación profesional.</p>
                        <div className="mascot-actions">
                            <button className="btn-id-primary-small">VER TUTORIALES</button>
                            <button className="btn-id-secondary-small-white">CONTACTAR BIBLIOTECARIO</button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style dangerouslySetInnerHTML={{ __html: `
                .library-page {
                    background: #f8fafc;
                }
                .library-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                .search-box-library {
                    background: white;
                    border: 1px solid #e2e8f0;
                    padding: 10px 20px;
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 350px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s;
                }
                .search-box-library:focus-within {
                    border-color: var(--secondary);
                    box-shadow: 0 10px 15px -3px rgba(22, 182, 214, 0.2);
                }
                .search-box-library input {
                    border: none;
                    outline: none;
                    width: 100%;
                    font-weight: 500;
                    font-size: 0.95rem;
                }
                .filter-tabs {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 50px;
                    flex-wrap: wrap;
                }
                .filter-tabs button {
                    padding: 12px 28px;
                    border-radius: 50px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .filter-tabs button:hover {
                    border-color: var(--secondary);
                    color: var(--secondary);
                }
                .filter-tabs button.active {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    box-shadow: 0 10px 20px rgba(42, 34, 102, 0.2);
                }
                .resources-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 30px;
                    margin-bottom: 80px;
                }
                .resource-card-premium {
                    background: white;
                    border-radius: 24px;
                    padding: 35px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                    position: relative;
                    overflow: hidden;
                }
                .resource-card-premium:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 25px 40px -10px rgba(0, 0, 0, 0.1);
                    border-color: var(--secondary);
                }
                .res-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }
                .res-icon.paid { background: #eef2ff; color: var(--primary); }
                .res-icon.free { background: #ecfeff; color: var(--secondary); }
                
                .resource-card-premium:hover .res-icon.paid { background: var(--primary); color: white; }
                .resource-card-premium:hover .res-icon.free { background: var(--secondary); color: white; }

                .res-type-badge {
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                    color: var(--text-muted);
                    margin-bottom: 8px;
                }
                .res-content h3 {
                    color: var(--primary);
                    margin-bottom: 12px;
                    font-size: 1.25rem;
                    font-weight: 800;
                }
                .res-content p {
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    line-height: 1.6;
                    margin-bottom: 25px;
                    min-height: 60px;
                }
                .btn-open-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--primary);
                    font-weight: 800;
                    text-decoration: none;
                    font-size: 0.85rem;
                    transition: all 0.3s;
                    background: #f8fafc;
                    padding: 12px 20px;
                    border-radius: 12px;
                    width: fit-content;
                }
                .btn-open-link:hover {
                    background: var(--secondary);
                    color: white;
                    padding-right: 25px;
                }

                .mascot-info-banner {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    border-radius: 35px;
                    padding: 50px;
                    display: flex;
                    align-items: center;
                    gap: 50px;
                    color: white;
                    margin-top: 40px;
                    box-shadow: 0 30px 60px rgba(42, 34, 102, 0.25);
                }
                .badge-mascot {
                    background: rgba(255, 255, 255, 0.15);
                    padding: 5px 15px;
                    border-radius: 50px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    display: inline-block;
                    margin-bottom: 15px;
                }
                .mascot-img { width: 180px; flex-shrink: 0; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.3)); }
                .mascot-text h4 { font-size: 2rem; margin-bottom: 10px; font-weight: 900; }
                .mascot-text p { opacity: 0.9; margin-bottom: 30px; font-size: 1.1rem; line-height: 1.5; max-width: 600px; }
                .mascot-actions { display: flex; gap: 15px; }
                
                .btn-id-secondary-small-white {
                    background: transparent;
                    color: white;
                    padding: 12px 25px;
                    border-radius: 10px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 0.85rem;
                }
                .btn-id-secondary-small-white:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: white;
                }

                @media (max-width: 992px) {
                    .mascot-info-banner { flex-direction: column; text-align: center; padding: 40px 20px; }
                    .mascot-actions { justify-content: center; }
                    .search-box-library { width: 100%; margin-top: 20px; }
                }
            `}} />
        </div>
    );
};

export default Biblioteca;
