import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentCard from './pages/StudentCard';
import Validator from './pages/Validator';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student" element={<StudentCard />} />
          <Route path="/validator" element={<Validator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
