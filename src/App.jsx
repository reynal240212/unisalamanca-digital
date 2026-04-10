import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AcademicDashboard from './pages/AcademicDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import RegistroDashboard from './pages/RegistroDashboard';
import CarteraDashboard from './pages/CarteraDashboard';
import AdmisionesDashboard from './pages/AdmisionesDashboard';
import BienestarDashboard from './pages/BienestarDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentCard from './pages/StudentCard';
import Validator from './pages/Validator';
import Home from './pages/Home';
import Characterization from './pages/Characterization';

const ACADEMIC_ROLES = ['COORD_ACADEMICO', 'DIRECTOR_PROGRAMA', 'ADMIN'];

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#64748b', fontWeight: 600 }}>Verificando sesión...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* ADMIN — control total */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* ACADEMIC — Coordinador + Directores de Programa */}
          <Route path="/academic" element={
            <ProtectedRoute allowedRoles={ACADEMIC_ROLES}>
              <AcademicDashboard />
            </ProtectedRoute>
          } />

          {/* PROFESOR — Docentes */}
          <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={['PROFESOR']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />

          {/* SECRETARÍA ACADÉMICA */}
          <Route path="/registro" element={
            <ProtectedRoute allowedRoles={['SECRETARIA_ACADEMICA', 'ADMIN']}>
              <RegistroDashboard />
            </ProtectedRoute>
          } />

          {/* CARTERA */}
          <Route path="/cartera" element={
            <ProtectedRoute allowedRoles={['CARTERA', 'ADMIN']}>
              <CarteraDashboard />
            </ProtectedRoute>
          } />

          {/* ADMISIONES */}
          <Route path="/admisiones" element={
            <ProtectedRoute allowedRoles={['ADMISIONES', 'ADMIN']}>
              <AdmisionesDashboard />
            </ProtectedRoute>
          } />

          {/* BIENESTAR UNIVERSITARIO */}
          <Route path="/bienestar" element={
            <ProtectedRoute allowedRoles={['BIENESTAR', 'ADMIN']}>
              <BienestarDashboard />
            </ProtectedRoute>
          } />

          {/* ESTUDIANTE */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['ESTUDIANTE', 'EGRESADO']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/characterization" element={
            <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
              <Characterization />
            </ProtectedRoute>
          } />

          <Route path="/validator" element={
            <ProtectedRoute allowedRoles={['VALIDADOR']}>
              <Validator />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
