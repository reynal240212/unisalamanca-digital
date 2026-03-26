import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../services/supabase';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) throw new Error('Usuario no encontrado');

      const isValid = await bcrypt.compare(password, data.password_hash);
      if (!isValid) throw new Error('Contraseña incorrecta');

      const sessionUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        must_change_password: data.must_change_password
      };

      setUser(sessionUser);
      localStorage.setItem('auth_user', JSON.stringify(sessionUser));
      localStorage.setItem('auth_token', 'dummy-token'); // For compatibility with old scripts if any
      
      return sessionUser;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('student_user');
    localStorage.removeItem('user_role');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
