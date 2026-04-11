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

      <div className="student-dashboard-grid" style={{ marginTop: '24px' }}>
        {/* LADO IZQUIERDO: MOVIMIENTOS */}
        <div className="profile-column">
          <div className="glass-card table-container-premium">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 30px', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-dark)' }}>Historial de Pagos</h3>
                <button className="nav-item-premium" style={{ margin: 0, fontSize: '0.75rem', padding: '8px 12px' }}>VER TODO</button>
             </div>
             
             <div className="premium-table-container">
                <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                   <thead>
                      <tr style={{ textAlign: 'left', background: 'rgba(0,0,0,0.02)' }}>
                         <th style={{ padding: '16px 30px', fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8' }}>Concepto</th>
                         <th style={{ padding: '16px', fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8' }}>Fecha</th>
                         <th style={{ padding: '16px', fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8' }}>Monto</th>
                         <th style={{ padding: '16px 30px', fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', textAlign: 'right' }}>Estado</th>
                      </tr>
                   </thead>
                   <tbody>
                      {recentMovements.map((move) => (
                         <tr key={move.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '20px 30px', fontWeight: 700, fontSize: '0.9rem' }}>{move.concept}</td>
                            <td style={{ padding: '20px', color: '#64748b', fontSize: '0.85rem' }}>{move.date}</td>
                            <td style={{ padding: '20px', fontWeight: 800, color: 'var(--primary-dark)' }}>{move.amount}</td>
                            <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                               <span className={`status-tag ${move.status === 'Pagado' ? 'en-curso' : 'terminado'}`} style={{ fontSize: '0.7rem', background: move.status === 'Pagado' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: move.status === 'Pagado' ? 'var(--success)' : 'var(--error)' }}>
                                  {move.status}
                               </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             {/* SYNC PLACEHOLDER */}
             <div style={{ padding: '40px 30px', textAlign: 'center', background: 'rgba(42, 34, 102, 0.02)' }}>
                <Database size={32} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '15px' }} />
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                   La pasarela de pagos seguros está vinculada a **Q10 Cartera**. 
                   <br/>Pronto podrás descargar tus recibos directamente aquí.
                </p>
             </div>
          </div>
        </div>

        {/* LADO DERECHO: ACCIONES RÁPIDAS */}
        <div className="profile-column">
           <div className="glass-card" style={{ padding: '30px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontWeight: 800, color: 'var(--primary-dark)' }}>Pagos Rápidos</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <button className="btn-login-modern" style={{ width: '100%', margin: 0, justifyContent: 'space-between' }}>
                    PAGAR MATRÍCULA <ArrowRightCircle size={18} />
                 </button>
                 <button className="nav-item-premium" style={{ width: '100%', margin: 0, justifyContent: 'space-between', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <Download size={18} /> Certificado de Pago
                    </div>
                 </button>
              </div>

              <div className="table-footer-info" style={{ marginTop: '30px' }}>
                <Info size={16} /> 
                <p>Las transferencias bancarias pueden tardar hasta 48 horas hábiles en reflejarse en el sistema.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
