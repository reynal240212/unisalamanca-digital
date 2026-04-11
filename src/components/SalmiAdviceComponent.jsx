import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { supabase } from '../services/supabase';

const SalmiAdviceComponent = ({ student, characterization }) => {
  const [advice, setAdvice] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingSpeed = 30; // ms per character
  const timerRef = useRef(null);

  const advicePool = [
    `¡Hola ${(student?.name || 'Estudiante').split(' ')[0]}! Recuerda que tu promedio de ${student?.gpa || 'N/A'} es excelente. ¡Sigue así!`,
    "¿Ya revisaste tus próximas clases? La organización es la clave del éxito en UniSalamanca.",
    "No olvides hidratarte y tomar descansos. Tu bienestar mental es tan importante como tus notas.",
    "Salmi dice: La persistencia supera al talento cuando el talento no se esfuerza.",
    "Aprovecha las tutorías disponibles este semestre. ¡Nunca está de más una mano extra!",
    "Tu carnet digital es tu llave a la universidad. ¡Asegúrate de tenerlo siempre a mano!"
  ];

  // Contextual advice based on characterization
  const getContextualAdvice = () => {
    if (!characterization) {
      return "¡Oye! Veo que aún no completas tu caracterización. Hazlo para que pueda darte mejores consejos.";
    }
    
    if (characterization.is_working === 'Si') {
      return "Lograr el equilibrio entre trabajo y estudio es un superpoder. ¡Admirable tu esfuerzo!";
    }

    if (characterization.interests) {
      return `¡Qué genial que te interese ${characterization.interests.split(',')[0]}! Busca semilleros de investigación sobre eso.`;
    }

    return advicePool[Math.floor(Math.random() * advicePool.length)];
  };

  const generateNewAdvice = async () => {
    if (isTyping) return;
    setIsTyping(true);
    setDisplayedText('');
    
    try {
      // Prompt dinámico basado en contexto real
      const prompt = `Genera un consejo muy corto (máximo 140 caracteres) para enviarle a ${(student?.name || 'un estudiante').split(' ')[0]}. 
      Contexto: Estudia ${student?.program || 'su carrera'}, semestre ${student?.semester || 'actual'}. Promedio: ${student?.gpa || 'N/A'}. 
      ${characterization?.is_working === 'Si' ? 'Dato: Trabaja y estudia al tiempo.' : ''}
      El tono debe ser motivacional pero profesional. Solo devuelve el consejo, sin introducciones.`;

      const { data, error } = await supabase.functions.invoke('salmi-ai', {
        body: { message: prompt }
      });

      if (error || !data) throw new Error("IA offline");
      
      setAdvice(data.response);
    } catch (err) {
      console.warn("Salmi AI Fallback:", err);
      // Fallback a lógica local si falla la IA
      const newAdvice = getContextualAdvice();
      setAdvice(newAdvice);
    }
  };

  const handleOpenChat = () => {
    // Emitir evento para abrir el chatbot
    const event = new CustomEvent('open-salmi-chat');
    window.dispatchEvent(event);
  };

  useEffect(() => {
    generateNewAdvice();
  }, []);

  useEffect(() => {
    if (isTyping && displayedText.length < advice.length) {
      timerRef.current = setTimeout(() => {
        setDisplayedText(advice.substring(0, displayedText.length + 1));
      }, typingSpeed);
    } else if (displayedText.length === advice.length) {
      setIsTyping(false);
    }

    return () => clearTimeout(timerRef.current);
  }, [displayedText, advice, isTyping]);

  return (
    <div className="salmi-advice-container section-reveal">
      <div className="salmi-avatar-wrapper">
        <div className="salmi-avatar-glow"></div>
        <img 
          src="/images/salmi-premium-v2.png" 
          alt="Salmi Mascot" 
          className={`salmi-mascot-img ${isTyping ? 'salmi-talking' : ''}`}
        />
      </div>

      <div className="salmi-bubble-glass">
        <div className="salmi-bubble-header">
          <div className="salmi-badge">
            <Sparkles size={14} /> <span>Mentor Digital</span>
          </div>
          <button 
            onClick={generateNewAdvice} 
            className={`salmi-refresh-btn ${isTyping ? 'rotating' : ''}`}
            disabled={isTyping}
            title="Nuevo consejo"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        
        <div className="salmi-message-content">
          <p className="salmi-text-typewriter">
            {displayedText}
            {isTyping && <span className="typewriter-cursor">|</span>}
          </p>
        </div>

        <div className="salmi-bubble-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageCircle size={14} />
            <span>Salmi te acompaña</span>
          </div>
          
          <button 
            onClick={handleOpenChat}
            className="salmi-chat-link-btn"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            Preguntar más a Salmi <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalmiAdviceComponent;
