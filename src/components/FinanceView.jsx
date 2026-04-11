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

      {/* CONTENIDO PRINCIPAL: ESTADO VACÍO */}
      <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', marginTop: '24px' }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(22, 182, 214, 0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)',
          margin: '0 auto 20px'
        }}>
          <Database size={40} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-dark)' }}>Sincronización de Cartera Pendiente</h3>
          <p style={{ color: '#64748b', maxWidth: '450px', margin: '8px auto' }}>
            Estamos vinculando tu estado de cuenta con **Q10 Finanzas**. Pronto podrás ver tus recibos, realizar pagos en línea y descargar certificados.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
          <span className="status-tag en-curso">
            <Clock size={14} /> Esperando Datos de Tesorería
          </span>
        </div>

        <div className="table-footer-info" style={{ marginTop: '50px' }}>
          <Info size={16} /> 
          <p>Cualquier duda sobre tu saldo actual puede ser resuelta en la oficina de Tesorería o mediante los canales de atención oficiales.</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
