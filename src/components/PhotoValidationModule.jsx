import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { CheckCircle2, XCircle, User, Loader2, Image as ImageIcon, Search, Filter } from 'lucide-react';

const PhotoValidationModule = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchPendingPhotos();
  }, []);

  const fetchPendingPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user')
      .select('id, name, email, program, photo_url, pending_photo_url, photo_status')
      .eq('photo_status', 'pending')
      .order('created_at', { ascending: false });

    if (!error) setPendingUsers(data || []);
    setLoading(false);
  };

  const handleApprove = async (user) => {
    if (!window.confirm(`¿Aprobar el cambio de foto para ${user.name}?`)) return;
    setProcessingId(user.id);
    try {
      const { error } = await supabase
        .from('user')
        .update({
          photo_url: user.pending_photo_url,
          photo_status: 'approved',
          pending_photo_url: null
        })
        .eq('id', user.id);

      if (error) throw error;
      setPendingUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (err) {
      console.error('Error approving photo:', err);
      alert('Error al aprobar la foto');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (user) => {
    if (!window.confirm(`¿Rechazar el cambio de foto para ${user.name}?`)) return;
    setProcessingId(user.id);
    try {
      const { error } = await supabase
        .from('user')
        .update({
          photo_status: 'rejected',
          pending_photo_url: null
        })
        .eq('id', user.id);

      if (error) throw error;
      setPendingUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (err) {
      console.error('Error rejecting photo:', err);
      alert('Error al rechazar la foto');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = pendingUsers.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase()) || 
    u.program?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '15px' }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" />
        <p style={{ color: '#64748b', fontWeight: 600 }}>Cargando solicitudes pendientes...</p>
      </div>
    );
  }

  return (
    <div className="section-reveal">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>Validación de Fotos</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{pendingUsers.length} solicitudes esperando revisión</p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Buscar estudiante o programa..." 
            className="input-premium"
            style={{ paddingLeft: '40px', fontSize: '0.85rem' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px', borderRadius: '24px' }}>
          <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={40} color="#16a34a" />
          </div>
          <h3 style={{ fontWeight: 800, color: '#1e293b' }}>¡Todo al día!</h3>
          <p style={{ color: '#64748b' }}>No hay fotos pendientes de validación en este momento.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredUsers.map(user => (
            <div key={user.id} className="glass-card-premium" style={{ padding: '20px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                   <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>Actual</p>
                   <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px', background: '#f1f5f9', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                      {user.photo_url ? (
                        <img src={user.photo_url} alt="Actual" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                          <User size={40} />
                        </div>
                      )}
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                   <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', textAlign: 'center' }}>Propuesta</p>
                   <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px', background: '#f0f9ff', overflow: 'hidden', border: '3px solid var(--primary)', boxShadow: '0 10px 20px rgba(22, 182, 214, 0.2)' }}>
                      <img src={user.pending_photo_url} alt="Nueva" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: 0, fontWeight: 900, color: '#1e293b', fontSize: '1.1rem' }}>{user.name}</h4>
                <p style={{ margin: '4px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{user.program}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleReject(user)}
                  className="btn-secondary-premium"
                  style={{ flex: 1, padding: '12px', borderColor: '#ef4444', color: '#ef4444' }}
                  disabled={processingId === user.id}
                >
                   Rechazar
                </button>
                <button 
                  onClick={() => handleApprove(user)}
                  className="btn-primary-premium"
                  style={{ flex: 2, padding: '12px', background: '#16a34a', border: 'none' }}
                  disabled={processingId === user.id}
                >
                  {processingId === user.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <><CheckCircle2 size={18} /> Aprobar Cambio</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoValidationModule;
