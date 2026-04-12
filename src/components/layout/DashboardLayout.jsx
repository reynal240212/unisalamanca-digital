import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ 
  children, 
  user, 
  navItems, 
  activeNav, 
  setActiveNav, 
  logout, 
  navigate, 
  variant = 'institutional' 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isStudent = variant === 'student';

  return (
    <div className="dashboard-wrapper">
      {/* MOBILE TOP BAR */}
      <div className="mobile-top-bar" style={{
          background: isStudent ? 'linear-gradient(90deg, #1e1b4b, #312e81)' : 'white',
          color: isStudent ? 'white' : 'var(--text-main)',
          borderBottom: isStudent ? 'none' : '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/images/escudo.png" alt="US" style={{ height: '32px' }} />
          <span style={{ fontWeight: 900, color: isStudent ? 'var(--secondary)' : 'var(--primary)' }}>
            UniSalamanca
          </span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="menu-circle"
          style={{ 
              background: isStudent ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: isStudent ? 'white' : 'var(--primary)',
              border: 'none'
          }}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <Sidebar 
        user={user}
        navItems={navItems}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        logout={logout}
        navigate={navigate}
        variant={variant}
      />

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        {children}
      </main>

      <style>{`
        .btn-logout-premium:hover {
          background: #ef4444 !important;
          color: white !important;
        }
        
        @media (max-width: 1024px) {
          .dashboard-main {
             padding-top: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
