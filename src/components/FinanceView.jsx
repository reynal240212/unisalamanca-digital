import React from 'react';
import { 
  Wallet, CreditCard, History, ArrowRightCircle, 
  Download, AlertCircle, Info, Database, Clock
} from 'lucide-react';

const FinanceView = ({ user }) => {
  // Datos ejemplo esperando Q10
  const financialStatus = {
    totalBalance: '$0.00',
    pendingPayments: 0,
    nextDueDate: 'N/A',
    status: 'Al Día'
  };

  const recentMovements = [
    { id: '1', date: '12 Feb 2026', concept: 'Matrícula Pregrado 2026-1', amount: '$4.250.000', status: 'Pagado' },
    { id: '2', date: '05 Ene 2026', concept: 'Derechos de Grado (Simulado)', amount: '$450.000', status: 'Anulado' },
  ];

  return (
    <div className="section-reveal finance-container">
      {/* HEADER */}
      <div className="grades-header-premium glass-card">
        <div className="grades-header-main">
          <div className="header-icon-box" style={{ background: 'rgba(22, 182, 214, 0.1)', color: 'var(--secondary)' }}>
            <Wallet size={28} />
          </div>
          <div>
            <h1 className="welcome-title" style={{ fontSize: '1.8rem', margin: 0 }}>Estado Financiero</h1>
            <p className="welcome-subtitle">Gestiona tus pagos, facturas e historial de tesorería.</p>
          </div>
        </div>
      </div>

      {/* KPI CARDS RESUMEN */}
      <div className="grades-stats-grid">
        <div className="kpi-card-premium">
          <div className="kpi-icon-row">
            <AlertCircle className="text-secondary" size={20} />
            <span>Estado de Cuenta</span>
          </div>
          <div className="kpi-value" style={{ color: 'var(--success)', fontSize: '1.5rem' }}>{financialStatus.status}</div>
        </div>
        
        <div className="kpi-card-premium">
          <div className="kpi-icon-row">
            <CreditCard className="text-primary" size={20} />
            <span>Saldo Pendiente</span>
          </div>
          <div className="kpi-value">{financialStatus.totalBalance}</div>
        </div>

        <div className="kpi-card-premium">
          <div className="kpi-icon-row">
            <History className="text-accent" size={20} />
            <span>Próximo Vencimiento</span>
          </div>
          <div className="kpi-value" style={{ fontSize: '1.2rem' }}>{financialStatus.nextDueDate}</div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: PLATAFORMA DE PAGOS */}
      <div className="finance-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginTop: '24px' }}>
        
        {/* Lado Izquierdo: Estado de Cuenta (Simulado) */}
        <div className="glass-card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
            <h3 style={{ margin: 0, fontWeight: 900, color: 'var(--primary-dark)', fontSize: '1.4rem' }}>Detalle de Cartera</h3>
            <span className="status-tag en-curso" style={{ background: '#fef3c7', color: '#92400e' }}>
              <Clock size={14} /> Sincronizando con Q10
            </span>
          </div>

          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(22, 182, 214, 0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)',
              margin: '0 auto 20px'
            }}>
              <Database size={32} />
            </div>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto', fontSize: '0.95rem' }}>
              Estamos vinculando tus recibos pendientes. Si conoces el valor a pagar, puedes usar los canales digitales a la derecha.
            </p>
          </div>

          <div className="table-footer-info" style={{ marginTop: '40px' }}>
            <Info size={16} /> 
            <p>Dudas sobre tu saldo: <strong>tesoreria@unisalamanca.edu.co</strong></p>
          </div>
        </div>

        {/* Lado Derecho: Pasarela de Pagos (NUEVO) */}
        <div className="payment-gateways-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '25px', background: 'var(--primary)', color: 'white', border: 'none' }}>
            <h4 style={{ margin: '0 0 15px', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={20} /> Pasarela Digital
            </h4>
            
            <div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a 
                href="https://solicitud.bancofinandina.com:8443/pagos-pse/recargar" 
                target="_blank" 
                className="payment-btn pse"
                style={{ 
                  background: 'white', color: '#004b93', padding: '12px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none',
                  fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.3s'
                }}
              >
                <span>Pagar con PSE</span>
                <ArrowRightCircle size={18} />
              </a>

              <a 
                href="https://checkout.bold.co/payment/LNK_LWCAK2UEGD" 
                target="_blank" 
                className="payment-btn bold"
                style={{ 
                  background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none',
                  fontWeight: 800, fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s'
                }}
              >
                <span>Pago con Bold</span>
                <ArrowRightCircle size={18} />
              </a>
            </div>

            <button 
              onClick={() => window.open('/pagos', '_blank')}
              style={{ 
                marginTop: '20px', width: '100%', background: 'var(--secondary)', color: 'white',
                border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 900,
                fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              MÁS OPCIONES DE PAGO <Info size={14} />
            </button>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>Soporte Físico</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>¿Pagaste en banco? Sube tu recibo aquí.</p>
            <button className="btn-id-secondary-small" style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <Download size={16} /> CARGAR SOPORTE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
