import React from 'react';
import { LogOut, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ user, navItems, activeNav, setActiveNav, isSidebarOpen, setIsSidebarOpen, logout, navigate, variant = 'institutional' }) => {
  const isStudent = variant === 'student';

  const sidebarStyles = {
    background: isStudent 
      ? 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)' 
      : 'var(--sidebar-bg)',
    color: 'white',
  };

  const studentIndicatorStyles = {
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    color: '#1e1b4b',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
  };

  const institutionalIndicatorStyles = {
    background: 'var(--secondary)',
    color: 'var(--primary-dark)',
  };

  return (
    <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`} style={sidebarStyles}>
      {/* BRANDING / HEADER */}
      <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', 
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <img src="/images/escudo.png" alt="Logo" style={{ width: '24px' }} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
              <span style={{ color: 'var(--secondary)' }}>Uni</span>Salamanca
            </div>
            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>
              {isStudent ? 'Experiencia Digital' : 'Sistema de Gestión'}
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav style={{ flex: 1, padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map((section, sIndex) => (
          <React.Fragment key={sIndex}>
            <p style={{ margin: sIndex === 0 ? '0 24px 10px' : '20px 24px 10px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>
              {section.title}
            </p>
            {section.items.map(item => (
              <button 
                key={item.id} 
                onClick={() => { 
                    if (item.onClick) {
                        item.onClick();
                    } else if (item.path) {
                        navigate(item.path);
                    } else {
                        setActiveNav(item.id);
                    }
                    setIsSidebarOpen(false); 
                }} 
                className={`sidebar-nav-item ${(activeNav === item.id || (item.path && window.location.pathname === item.path)) ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </nav>

      {/* USER PROFILE & LOGOUT */}
      <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
          background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '16px' 
        }}>
          <div style={{ 
            width: '38px', height: '38px', 
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 900, 
            ...(isStudent ? studentIndicatorStyles : institutionalIndicatorStyles)
          }}>
            {(user?.name || 'U').charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 800, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: 'white' }}>
                {user?.name || 'Usuario'}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                {user?.role?.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
        
        <button onClick={() => { logout(); navigate('/'); }} className="btn-logout-premium" style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)',
            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
        }}>
          <LogOut size={18} /> <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
