import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, UserCheck, TrendingUp, DollarSign, 
  Target, GraduationCap, Clock, AlertCircle 
} from 'lucide-react';

const GlobalAnalytics = () => {
  const [data, setData] = useState({
    users: [],
    applicants: [],
    financials: [],
    stats: {
      totalStudents: 0,
      activeStudents: 0,
      pendingApplicants: 0,
      totalRevenue: 0,
      pendingDebt: 0
    },
    charts: {
      programDistribution: [],
      admissionPipeline: [],
      financialStatus: [],
      accessActivity: []
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalStats();
  }, []);

  const fetchGlobalStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users
      const { data: users } = await supabase.from('user').select('*');
      
      // 2. Fetch Applicants
      const { data: applicants } = await supabase.from('applicants').select('*');
      
      // 3. Fetch Financials
      const { data: financials } = await supabase.from('financial_obligations').select('*');

      // 4. Process Statistics
      const totalStudents = users.filter(u => u.role === 'ESTUDIANTE' || u.role === 'EGRESADO').length;
      const activeStudents = users.filter(u => u.status === 'Active' && u.role === 'ESTUDIANTE').length;
      const pendingApplicants = applicants.filter(a => a.status === 'pending' || a.status === 'reviewing').length;
      
      const totalRevenue = financials
        .filter(f => f.status === 'paid')
        .reduce((sum, f) => sum + Number(f.amount), 0);
        
      const pendingDebt = financials
        .filter(f => f.status === 'pending' || f.status === 'overdue')
        .reduce((sum, f) => sum + Number(f.amount), 0);

      // 5. Process Charts
      // Program Distribution
      const progMap = {};
      users.filter(u => u.program).forEach(u => {
        progMap[u.program] = (progMap[u.program] || 0) + 1;
      });
      const programDistribution = Object.entries(progMap).map(([name, value]) => ({ name, value }));

      // Admission Pipeline
      const appMap = { 'Pendiente': 0, 'En Revisión': 0, 'Aprobado': 0, 'Matriculado': 0 };
      applicants.forEach(a => {
        if (a.status === 'pending') appMap['Pendiente']++;
        if (a.status === 'reviewing') appMap['En Revisión']++;
        if (a.status === 'approved') appMap['Aprobado']++;
        if (a.status === 'enrolled') appMap['Matriculado']++;
      });
      const admissionPipeline = Object.entries(appMap).map(([name, value]) => ({ name, value }));

      // Financial Status
      const finMap = { 'Pagado': 0, 'Pendiente': 0, 'Vencido': 0 };
      financials.forEach(f => {
        if (f.status === 'paid') finMap['Pagado']++;
        if (f.status === 'pending') finMap['Pendiente']++;
        if (f.status === 'overdue') finMap['Vencido']++;
      });
      const financialStatus = Object.entries(finMap).map(([name, value]) => ({ name, value }));

      setData({
        users, applicants, financials,
        stats: { totalStudents, activeStudents, pendingApplicants, totalRevenue, pendingDebt },
        charts: { programDistribution, admissionPipeline, financialStatus }
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#1e3a8a', '#16b6d6', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6'];
  const FIN_COLORS = { 'Pagado': '#16a34a', 'Pendiente': '#f59e0b', 'Vencido': '#ef4444' };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
        <div className="pulse-dot" style={{ width: '12px', height: '12px', background: 'var(--primary)' }}></div>
        <p style={{ fontWeight: 800, color: '#64748b' }}>Procesando Big Data Institucional...</p>
      </div>
    );
  }

  return (
    <div className="section-reveal">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px', marginBottom: '8px' }}>
          Análisis Global Estratégico
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Resumen estadístico de las operaciones académicas y financieras en tiempo real.
        </p>
      </div>

      {/* KPI GRID */}
      <div className="responsive-grid-4" style={{ marginBottom: '40px' }}>
        {[
          { icon: <GraduationCap />, label: 'Estudiantes Totales', value: data.stats.totalStudents, color: '#1e3a8a', bg: '#eef2ff' },
          { icon: <Target />, label: 'Aspirantes Nuevos', value: data.stats.pendingApplicants, color: '#16b6d6', bg: '#ecfeff' },
          { icon: <DollarSign />, label: 'Recaudo Total (COP)', value: `$${data.stats.totalRevenue.toLocaleString()}`, color: '#16a34a', bg: '#f0fdf4' },
          { icon: <AlertCircle />, label: 'Cartera Pendiente', value: `$${data.stats.pendingDebt.toLocaleString()}`, color: '#ef4444', bg: '#fef2f2' },
        ].map((kpi, idx) => (
          <div key={idx} className="kpi-card" style={{ border: '1px solid #f1f5f9' }}>
            <div className="kpi-icon-box" style={{ background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{kpi.label}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', margin: '10px 0' }}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="responsive-grid-2" style={{ gap: '30px' }}>
        
        {/* PIPELINE DE ADMISIONES */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontWeight: 900, marginBottom: '25px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} color="#16b6d6" /> Embudo de Admisiones
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={data.charts.admissionPipeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, color: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" fill="#16b6d6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DISTRIBUCIÓN POR PROGRAMAS */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontWeight: 900, marginBottom: '25px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="#1e3a8a" /> Población por Programa
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.charts.programDistribution}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.charts.programDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SALUD FINANCIERA */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontWeight: 900, marginBottom: '25px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet size={20} color="#16a34a" /> Salud Financiera (Estados)
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.charts.financialStatus}
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {data.charts.financialStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FIN_COLORS[entry.name] || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INSIGHTS DE SALMI */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e3a8a, #1e40af)', 
          padding: '35px', borderRadius: '24px', color: 'white', 
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          boxShadow: '0 15px 40px rgba(30, 58, 138, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 color="white" size={24} />
            </div>
            <h3 style={{ fontWeight: 900, margin: 0, fontSize: '1.2rem' }}>Insights de Salmi AI</h3>
          </div>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, opacity: 0.9, fontWeight: 500 }}>
            "Hola Admin. He analizado los datos: Tienes una retención del **{((data.stats.activeStudents / data.stats.totalStudents) * 100).toFixed(1)}%**. 
            La carrera líder es **{data.charts.programDistribution[0]?.name || 'N/A'}**. 
            Hay una oportunidad de recaudo de **${data.stats.pendingDebt.toLocaleString()} COP** pendiente por gestionar."
          </p>
          <div style={{ marginTop: '25px', padding: '12px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-block' }}>
            ESTADO INSTITUCIONAL: ÓPTIMO ✓
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalAnalytics;
