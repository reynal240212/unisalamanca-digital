import React, { useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { Camera, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const AvatarUpload = ({ user, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(user?.photo_status || 'approved');
  const fileInputRef = useRef();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones básicas
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen es muy pesada. Máximo 2MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    // Iniciar subida
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Actualizar tabla de usuarios con estado PENDIENTE
      const { error: updateError } = await supabase
        .from('user')
        .update({ 
          pending_photo_url: publicUrl,
          photo_status: 'pending' 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setStatus('pending');
      if (onUploadComplete) onUploadComplete(publicUrl);
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Error al subir la foto: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="avatar-upload-container">
      <div className="avatar-preview-wrapper" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
        <div className={`avatar-preview-circle ${status === 'pending' ? 'status-pending' : ''}`}>
          <img 
            src={previewUrl || user?.photo_url || '/images/default-avatar.png'} 
            alt="Avatar" 
            className="avatar-image-actual"
          />
          {isUploading && (
            <div className="avatar-overlay-loading">
              <Loader2 className="animate-spin" size={32} color="white" />
            </div>
          )}
          {!isUploading && (
            <div className="avatar-edit-badge">
              <Camera size={16} />
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      </div>

      <div className="avatar-status-info">
        {status === 'pending' ? (
          <div className="status-badge-pending">
            <RefreshCw size={14} className="animate-spin-slow" /> Foto en revisión por administración
          </div>
        ) : status === 'rejected' ? (
          <div className="status-badge-rejected">
             <AlertCircle size={14} /> Foto rechazada. Por favor sube una nueva.
          </div>
        ) : (
          <div className="status-badge-approved">
             <CheckCircle size={14} /> Foto institucional verificada
          </div>
        )}
        {error && <p className="avatar-upload-error">{error}</p>}
      </div>
    </div>
  );
};

export default AvatarUpload;
