import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../services/supabase';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

// Calcula el semestre automáticamente basado en la fecha de ingreso
const calcularSemestre = (entryDate) => {
  if (!entryDate) return '1er Semestre';
  const now = new Date();
  const entry = new Date(entryDate);

  const semActual = now.getMonth() >= 6 ? 2 : 1;
  const semIngreso = entry.getMonth() >= 6 ? 2 : 1;

  const total = (now.getFullYear() - entry.getFullYear()) * 2
    + (semActual - semIngreso) + 1;

  const num = Math.max(1, total);
  const sufijo = num === 1 ? 'er' : num === 3 ? 'er' : 'o';
  return `${num}${sufijo} Semestre`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al arrancar, restaurar sesión desde localStorage
  useEffect(() => {
    const cached = localStorage.getItem('auth_user');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (_) {
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Buscar usuario en Supabase por email
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .ilike('email', email.trim())
      .single();

    if (error || !data) {
      throw new Error('Correo o contraseña incorrectos');
    }

    if (data.status === 'Suspended') {
      throw new Error('Tu cuenta está suspendida. Contacta a secretaría.');
    }

    // Verificar contraseña con bcrypt
    const passwordMatch = await bcrypt.compare(password, data.password_hash || '');
    if (!passwordMatch) {
      throw new Error('Correo o contraseña incorrectos');
    }

    // Calcular semestre real desde entry_date
    const semestre = calcularSemestre(data.entry_date);

    const sessionUser = {
      ...data,
      semester: semestre,
    };

    setUser(sessionUser);
    localStorage.setItem('auth_user', JSON.stringify(sessionUser));
    return sessionUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
