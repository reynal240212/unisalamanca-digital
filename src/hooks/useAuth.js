import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../services/supabase';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

      // En el PRD se menciona bcrypt para seguridad
      const isValid = await bcrypt.compare(password, data.password_hash);
      if (!isValid) throw new Error('Contraseña incorrecta');

      const sessionUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
      };

      setUser(sessionUser);
      localStorage.setItem('auth_user', JSON.stringify(sessionUser));
      return sessionUser;
    } catch (err) {
      throw err;
    }
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
