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
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al arrancar, restaurar sesión desde localStorage
  useEffect(() => {
    const cachedUser = localStorage.getItem('auth_user');
    const cachedRole = localStorage.getItem('auth_active_role');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        if (cachedRole) setActiveRole(cachedRole);
      } catch (_) {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_active_role');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Buscar usuario en Supabase por email
    const { data, error } = await supabase
      .from('user')
      .select('*, academic_program_info:academic_programs(name)')
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

    const { data: charData } = await supabase
      .from('characterization')
      .select('completed_at')
      .eq('user_id', data.id)
      .maybeSingle();

    const semestre = calcularSemestre(data.entry_date);
    const sessionUser = {
      ...data,
      program: data.academic_program_info?.name || data.program, // Normalizar a string
      semester: semestre,
      characterization_completed: !!charData,
    };

    setUser(sessionUser);
    localStorage.setItem('auth_user', JSON.stringify(sessionUser));
    
    // Configurar rol activo. Si solo hay 1 rol, asignarlo automáticamente
    const rolesArray = sessionUser.roles || [sessionUser.role];
    if (rolesArray.length === 1) {
      setActiveRole(rolesArray[0]);
      localStorage.setItem('auth_active_role', rolesArray[0]);
    } else {
      // Si tiene múltiples y arranca sesión de nuevo, limpiamos rol activo
      // para forzar al selector siempre en el login
      setActiveRole(null);
      localStorage.removeItem('auth_active_role');
    }
    
    return sessionUser;
  };

  const selectRole = (role) => {
    setActiveRole(role);
    localStorage.setItem('auth_active_role', role);
  };

  const logout = () => {
    setUser(null);
    setActiveRole(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_active_role');
    window.location.replace('/');
  };

  const acceptPolicy = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user')
        .update({ policy_accepted: true })
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = { ...user, policy_accepted: true };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return true;
    } catch (err) {
      console.error('Error accepting policy:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, activeRole, selectRole, login, logout, acceptPolicy, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
