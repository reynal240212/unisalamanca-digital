import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, UserCheck, TrendingUp, DollarSign, 
  Target, GraduationCap, Clock, AlertCircle, CheckCircle2, Wallet, Sparkles
} from 'lucide-react';

const GlobalAnalytics = () => {
  const [data, setData] = useState({
    users: [],
    applicants: [],
    financials: [],
    characterization: [],
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
      accessActivity: [],
      estratoDistribution: [],
      employmentStatus: [],
      parentEducation: []
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
      const { data: usersRaw } = await supabase.from('user').select('*');
      const users = usersRaw || [];
      
      // 2. Fetch Applicants
      const { data: applicantsRaw } = await supabase.from('applicants').select('*');
      const applicants = applicantsRaw || [];
      
      // 3. Fetch Financials
      const { data: financialsRaw } = await supabase.from('financial_obligations').select('*');
      const financials = financialsRaw || [];
      
      // 4. Fetch Characterization
      const { data: charRaw } = await supabase.from('characterization').select('*');
      const characterization = charRaw || [];

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

      // Socioeconomic Charts processing
      const estMap = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 };
      const workMap = { 'Trabaja': 0, 'No Trabaja': 0 };
      const eduMap = {};
      
      characterization.forEach(c => {
        if (c.estrato) estMap[c.estrato]++;
        if (c.is_working === 'Si') workMap['Trabaja']++;
        else workMap['No Trabaja']++;
        if (c.parent_education) eduMap[c.parent_education] = (eduMap[c.parent_education] || 0) + 1;
      });
      
      const estratoDistribution = Object.entries(estMap).map(([name, value]) => ({ name: `Estrato ${name}`, value }));
      const employmentStatus = Object.entries(workMap).map(([name, value]) => ({ name, value }));
      const parentEducation = Object.entries(eduMap).map(([name, value]) => ({ name, value }));

      setData({
        users, applicants, financials, characterization,
        stats: { totalStudents, activeStudents, pendingApplicants, totalRevenue, pendingDebt },
        charts: { 
          programDistribution, 
          admissionPipeline, 
          financialStatus,
          estratoDistribution,
          employmentStatus,
          parentEducation
        }
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

      {/* KPI GRID - STRATEGIC METRICS */}
      <div className="responsive-grid-4" style={{ marginBottom: '48px' }}>
        {[
          { icon: <GraduationCap size={24} />, label: 'Estudiantes Totales', value: data.stats.totalStudents, color: '#1e3a8a', bg: '#eef2ff' },
          { icon: <Target size={24} />, label: 'Aspirantes Nuevos', value: data.stats.pendingApplicants, color: '#16b6d6', bg: '#ecfeff' },
          { icon: <DollarSign size={24} />, label: 'Recaudo Total (COP)', value: `$${data.stats.totalRevenue.toLocaleString()}`, color: '#16a34a', bg: '#f0fdf4' },
          { icon: <AlertCircle size={24} />, label: 'Cartera Pendiente', value: `$${data.stats.pendingDebt.toLocaleString()}`, color: '#ef4444', bg: '#fef2f2' },
        ].map((kpi, idx) => (
          <div key={idx} className="kpi-card" style={{ 
            padding: '30px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-10px', 
              right: '-10px', 
              width: '80px', 
              height: '80px', 
              background: `radial-gradient(circle, ${kpi.color}08 0%, transparent 70%)`,
              borderRadius: '50%'
            }} />
            
            <div className="kpi-icon-box" style={{ 
              background: kpi.bg, 
              color: kpi.color,
              width: '52px',
              height: '52px',
              borderRadius: '16px'
            }}>
              {kpi.icon}
            </div>
            
            <p style={{ 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              color: '#94a3b8', 
              textTransform: 'uppercase', 
              letterSpacing: '1.2px',
              marginBottom: '8px'
            }}>
              {kpi.label}
            </p>
            
            <h3 style={{ 
              fontSize: '2.2rem', 
              fontWeight: 900, 
              color: '#0f172a', 
              margin: 0,
              letterSpacing: '-1px'
            }}>
              {kpi.value}
            </h3>
            
            <div style={{ 
              marginTop: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: kpi.color 
              }} />
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#64748b', 
                fontWeight: 600 
              }}>Actualizado</span>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS GRID - MAIN ANALYTICS */}
      <div className="responsive-grid-2" style={{ gap: '30px', marginBottom: '40px' }}>
        
        {/* PIPELINE DE ADMISIONES */}
        <div className="glass-card" style={{ padding: '30px' }}>
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
        <div className="glass-card" style={{ padding: '30px' }}>
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
        <div className="glass-card" style={{ padding: '30px' }}>
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

        {/* INSIGHTS DE SALMI - INTEGRADO COMO TARJETA DE ACCIÓN */}
        <div style={{ 
          background: 'linear-gradient(135deg, #2A2266 0%, #1e184d 100%)', 
          padding: '35px', borderRadius: '28px', color: 'white', 
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(42, 34, 102, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(22, 182, 214, 0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', position: 'relative' }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles color="#16B6D6" size={26} />
            </div>
            <h3 style={{ fontWeight: 900, margin: 0, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>Análisis Inteligente Salmi</h3>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.95, fontWeight: 500, margin: 0 }}>
              "Hola Admin. He analizado los datos: Tienes una retención del **{data.stats.totalStudents > 0 ? ((data.stats.activeStudents / data.stats.totalStudents) * 100).toFixed(1) : 0}%**. 
              La carrera líder es **{data.charts.programDistribution[0]?.name || 'N/A'}**. 
              Hay una oportunidad de recaudo de **${(data.stats.pendingDebt || 0).toLocaleString()} COP** pendiente por gestionar."
            </p>
          </div>
          
          <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px 16px', background: 'rgba(22, 182, 214, 0.2)', color: '#16B6D6', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              ESTADO: ÓPTIMO ✓
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Sincronizado hace un momento</div>
          </div>
        </div>

      </div>

      {/* SECCIÓN SOCIOECONÓMICA PREMIUM */}
      <div style={{ marginTop: '50px', paddingTop: '50px', borderTop: '2px dashed #e2e8f0' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={28} /> Perfil Socioeconómico y Bienestar
          </h2>
          <p style={{ color: '#64748b' }}>Análisis profundo de la población estudiantil basado en fichas de caracterización ({((data.characterization?.length / (data.stats.totalStudents || 1)) * 100).toFixed(1)}% completado).</p>
        </div>

        <div className="responsive-grid-3" style={{ gap: '24px' }}>
          {/* DISTRIBUCIÓN POR ESTRATO */}
          <div className="glass-card" style={{ padding: '25px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.5px' }}>Distribución por Estrato</h4>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.charts.estratoDistribution} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.charts.estratoDistribution.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ESTADO LABORAL */}
          <div className="glass-card" style={{ padding: '25px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.5px' }}>Estudiantes que Laboran</h4>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer>
                <BarChart data={data.charts.employmentStatus}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} fontWeight={600} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" fill="var(--secondary)" radius={[6, 6, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* EDUCACIÓN PARENTAL */}
          <div className="glass-card" style={{ padding: '25px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.5px' }}>Educación Red de Apoyo</h4>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer>
                <BarChart layout="vertical" data={data.charts.parentEducation}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" fontSize={10} width={80} axisLine={false} tickLine={false} fontWeight={600} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalAnalytics;
