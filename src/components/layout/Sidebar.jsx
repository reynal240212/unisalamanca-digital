import React, { useState } from 'react';
import { LogOut, LayoutDashboard, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ user: externalUser, navItems, activeNav, setActiveNav, isSidebarOpen, setIsSidebarOpen, logout: externalLogout, navigate, variant = 'institutional' }) => {
  const { user: authUser, activeRole, selectRole, logout: authLogout } = useAuth();
  const user = externalUser || authUser;
  const logout = externalLogout || authLogout;
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  
  const currentRole = activeRole || user?.role;
  const userRoles = user?.roles || [user?.role];

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
      <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
        
        {/* Role Switcher Menu */}
        {showRoleMenu && userRoles.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 'calc(100% - 10px)', left: '24px', width: 'calc(100% - 48px)',
            background: 'var(--sidebar-bg)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '8px', zIndex: 10,
            boxShadow: '0 -10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 12px', fontWeight: 800 }}>Cambiar Perfil</div>
            {userRoles.map(role => (
              <button 
                key={role}
                onClick={() => {
                  selectRole(role);
                  setShowRoleMenu(false);
                  
                  // Redirect to appropriate dashboard
                  const roleMap = {
                    ADMIN: '/admin', COORD_ACADEMICO: '/academic', DIRECTOR_PROGRAMA: '/academic',
                    PROFESOR: '/teacher', SECRETARIA_ACADEMICA: '/registro', CARTERA: '/cartera',
                    ADMISIONES: '/admisiones', BIENESTAR: '/bienestar', VALIDADOR: '/validator',
                    ESTUDIANTE: '/student', EGRESADO: '/student'
                  };
                  navigate(roleMap[role] || '/student', { replace: true });
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                  padding: '10px 12px', background: currentRole === role ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer',
                  textAlign: 'left', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => { if(currentRole !== role) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                onMouseOut={(e) => { if(currentRole !== role) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', fontWeight: currentRole === role ? 700 : 400 }}>
                  {role.replace('_', ' ').toLowerCase()}
                </span>
                {currentRole === role && <Check size={14} color="var(--secondary)" />}
              </button>
            ))}
          </div>
        )}

        <button 
          onClick={() => userRoles.length > 1 ? setShowRoleMenu(!showRoleMenu) : null}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', width: '100%',
            background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '16px',
            border: 'none', cursor: userRoles.length > 1 ? 'pointer' : 'default', textAlign: 'left',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => { if(userRoles.length > 1) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
        >
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.name}
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                objectFit: 'cover', flexShrink: 0,
                border: '2px solid rgba(255,255,255,0.15)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}
            />
          ) : (
            <div style={{ 
              width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 900, flexShrink: 0, ...(isStudent ? studentIndicatorStyles : institutionalIndicatorStyles)
            }}>
              {(user?.name || 'U').charAt(0)}
            </div>
          )}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ fontWeight: 800, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: 'white' }}>
                {user?.name || 'Usuario'}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                {currentRole?.toLowerCase().replace('_', ' ')}
            </p>
          </div>
          {userRoles.length > 1 && (
            <ChevronDown size={16} color="rgba(255,255,255,0.4)" style={{ transform: showRoleMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          )}
        </button>
        
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
