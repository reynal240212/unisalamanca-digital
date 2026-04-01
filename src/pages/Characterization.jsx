import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CharacterizationForm from '../components/CharacterizationForm';
import { useCharacterization } from '../hooks/useCharacterization';
import { ArrowLeft, LayoutDashboard, ShieldCheck, Info } from 'lucide-react';

const Characterization = () => {
  const { user } = useAuth();
  const { profileCompleted, setProfileCompleted, checkCharacterization } = useCharacterization(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkCharacterization();
    }
  }, [user, checkCharacterization]);

  const handleComplete = () => {
    setProfileCompleted(true);
    // Redirect to dashboard with a success message
    navigate('/student', { state: { message: '¡Caracterización completada con éxito!' } });
  };

  return (
    <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '40px 20px'
    }}>
      {/* HEADER PREMIUM */}
      <header style={{ 
          maxWidth: '1000px', 
          margin: '0 auto 40px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <div style={{ 
                 width: '50px', height: '50px', background: 'white', borderRadius: '15px', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
             }}>
                 <img src="/images/escudo.png" alt="US" style={{ height: '35px' }} />
             </div>
             <div>
                <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-dark)' }}>
                   Caracterización Estudiantil
                </h1>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                   Identidad Digital UniSalamanca
                </p>
             </div>
        </div>

        <button 
          onClick={() => navigate('/student')}
          style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '12px 20px', background: 'white', border: '1px solid #e2e8f0', 
              borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, 
              color: '#475569', cursor: 'pointer', transition: 'all 0.3s ease'
          }}
          className="hover-lift"
        >
          <LayoutDashboard size={18} /> Volver al Inicio
        </button>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="section-reveal" style={{ marginBottom: '30px' }}>
            <div style={{ 
                background: 'var(--primary)', color: 'white', borderRadius: '24px', 
                padding: '30px', position: 'relative', overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(42, 34, 102, 0.2)'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <ShieldCheck size={20} color="var(--secondary)" />
                         <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Proceso Seguro y Obligatorio</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>Tu Identidad, Tu Seguridad</h2>
                    <p style={{ margin: '10px 0 0', fontSize: '0.95rem', opacity: 0.9, maxWidth: '600px', lineHeight: '1.6' }}>
                        Completa este breve formulario para habilitar tu **Carnet Digital de Alta Seguridad** y acceder a todos los beneficios institucionales.
                    </p>
                </div>
                {/* DECORATIVE ELEMENT */}
                <div style={{ 
                    position: 'absolute', right: '-20px', bottom: '-20px', 
                    opacity: 0.1, transform: 'rotate(-15deg)' 
                }}>
                    <Info size={200} />
                </div>
            </div>
        </div>

        <div className="section-reveal" style={{ animationDelay: '0.2s' }}>
            <CharacterizationForm user={user} onComplete={handleComplete} />
        </div>

        <footer style={{ 
            textAlign: 'center', marginTop: '60px', padding: '30px 0', 
            borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.8rem' 
        }}>
            <p>© 2026 Universidad UniSalamanca - Ecosistema Digital de Alta Fidelidad</p>
            <p style={{ marginTop: '5px' }}>Protección de Datos Personales conforme a la Ley 1581 de 2012</p>
        </footer>
      </main>

      <style>{`
        .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            border-color: var(--secondary);
            color: var(--secondary);
        }
      `}</style>
    </div>
  );
};

export default Characterization;
