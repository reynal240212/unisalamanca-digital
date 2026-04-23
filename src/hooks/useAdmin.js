import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

export const useAdmin = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    teachers: 0,
    admins: 0,
    graduates: 0
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setUsers(data || []);
      
      // Calcular stats básicos
      setStats({
        total: data.length,
        students: data.filter(u => u.role === 'ESTUDIANTE').length,
        teachers: data.filter(u => u.role === 'PROFESOR').length,
        admins: data.filter(u => u.role === 'ADMIN').length,
        graduates: data.filter(u => u.role === 'EGRESADO').length,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('access_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  }, []);

  const updateUser = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('user')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      await fetchUsers(); // Refresh
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteUser = async (id) => {
    try {
      const { error } = await supabase
        .from('user')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await fetchUsers();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    users,
    logs,
    loading,
    stats,
    fetchUsers,
    fetchLogs,
    updateUser,
    deleteUser
  };
};
