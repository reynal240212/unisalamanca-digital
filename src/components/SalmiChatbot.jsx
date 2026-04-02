import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Sparkles, BookOpen, GraduationCap, Info } from 'lucide-react';
import { supabase } from '../services/supabase';

const SalmiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "¡Hola! Soy Salmi, tu asistente de UniSalamanca. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre la misión, bienestar o cualquier carrera (Software, Administración, etc.)", 
      sender: 'salmi',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // NUEVO: Control de voz
  const messagesEndRef = useRef(null);
  const synth = window.speechSynthesis;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Función de Voz (TTS) con efecto de mascota inteligente
  const speakAsSquirrel = (text) => {
    if (isMuted || !text) return;
    
    // Detener cualquier voz previa
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Intentar encontrar una voz en español de mejor calidad
    const voices = synth.getVoices();
    const spanishVoice = voices.find(v => v.lang.includes('es')) || voices[0];
    if (spanishVoice) utterance.voice = spanishVoice;

    utterance.lang = 'es-ES';
    utterance.pitch = 1.3; // Más inteligente, menos "chirriante" que antes
    utterance.rate = 1.05; // Velocidad natural pero proactiva
    utterance.volume = 1.0;
    
    synth.speak(utterance);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Salmi Logic: Call the "IA Real" Edge Function
    try {
      // Intentar llamar a la Edge Function de IA
      const { data, error } = await supabase.functions.invoke('salmi-ai', {
        body: { message: inputText }
      });

      let responseText = "";

      if (error || !data) {
        console.error("AI Function Error:", error);
        // Fallback local básico si la función falla
        const query = inputText.toLowerCase();
        responseText = "Oh, parece que mi conexión cerebral está un poco lenta. ¿Podrías repetirme la pregunta sobre la misión, bienestar o nuestras carreras de forma más directa?";
      } else {
        responseText = data.response;
      }

      // Add Salmi's response
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: responseText,
        sender: 'salmi',
        timestamp: new Date()
      }]);
      setIsTyping(false);

      // ¡Hablar!
      speakAsSquirrel(responseText);

    } catch (error) {
      console.error("Salmi Chat Error:", error);
      setIsTyping(false);
      const errorMsg = "Lo siento, tuve un pequeño tropiezo digital. ¿Me lo puedes volver a preguntar?";
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: errorMsg,
        sender: 'salmi',
        timestamp: new Date()
      }]);
      speakAsSquirrel(errorMsg);
    }
  };

  return (
    <div className="salmi-chatbot-wrapper">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          className="salmi-chat-toggle"
          onClick={() => setIsOpen(true)}
        >
          <div className="salmi-toggle-badge">1</div>
          <img src="/images/salmi-premium-v2.png" alt="Salmi" className="salmi-toggle-avatar" />
          <span className="salmi-toggle-text">¿Dudas? Pregúntame</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="salmi-chat-container">
          {/* Header */}
          <div className="salmi-chat-header">
            <div className="salmi-header-info">
              <div className="salmi-header-avatar">
                <img src="/images/salmi-premium-v2.png" alt="Salmi" />
                <div className="online-indicator"></div>
              </div>
              <div className="salmi-header-text">
                <h3>Salmi</h3>
                <span>Mentoría Digital 24/7</span>
              </div>
            </div>
            <div className="salmi-header-actions" style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                title={isMuted ? "Activar Voz" : "Silenciar Voz"}
                style={{ background: isMuted ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isMuted ? <Sparkles size={16} opacity={0.5} /> : <Sparkles size={16} color="#fff" />}
              </button>
              <button onClick={() => setIsOpen(false)} title="Minimizar">
                <Minimize2 size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="salmi-chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message-bubble-wrapper ${msg.sender}`}>
                {msg.sender === 'salmi' && (
                  <div className="msg-avatar">
                    <img src="/images/salmi-premium-v2.png" alt="Salmi" />
                  </div>
                )}
                <div className={`message-bubble ${msg.sender}`}>
                  <p>{msg.text}</p>
                  <span className="msg-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-bubble-wrapper salmi">
                <div className="msg-avatar">
                  <img src="/images/salmi-premium-v2.png" alt="Salmi" />
                </div>
                <div className="message-bubble salmi typing">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="salmi-quick-actions">
            <button onClick={() => setInputText('Misión')}><Info size={12}/> Institución</button>
            <button onClick={() => setInputText('Programas')}><GraduationCap size={12}/> Carreras</button>
            <button onClick={() => setInputText('Bienestar')}><Sparkles size={12}/> Bienestar</button>
          </div>

          {/* Input Area */}
          <form className="salmi-chat-input" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Escribe tu duda aquí..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" disabled={!inputText.trim() || isTyping}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SalmiChatbot;
