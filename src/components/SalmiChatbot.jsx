import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Sparkles, BookOpen, GraduationCap, Info } from 'lucide-react';
import { supabase } from '../services/supabase';
import ReactMarkdown from 'react-markdown';

const SalmiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Bienvenido al canal de atención de UniSalamanca. ¿En qué podemos ayudarle hoy? Puede consultar sobre programas académicos, bienestar institucional o procesos de admisión.", 
      sender: 'salmi',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Escuchar evento para abrir el chat externamente
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-salmi-chat', handleOpenChat);
    return () => window.removeEventListener('open-salmi-chat', handleOpenChat);
  }, []);

  // AGITAR PARA ACTIVAR (Shake to Activate)
  useEffect(() => {
    let lastX, lastY, lastZ;
    let lastUpdate = 0;
    const SHAKE_THRESHOLD = 15;

    const onDeviceMotion = (event) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const currentTime = Date.now();
      if ((currentTime - lastUpdate) > 100) {
        const diffTime = currentTime - lastUpdate;
        lastUpdate = currentTime;

        const { x, y, z } = acceleration;

        if (lastX !== undefined) {
          const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

          if (speed > 800) { // Umbral de velocidad para agitar
            setIsOpen(true);
            // Feedback vibración si está disponible
            if (navigator.vibrate) navigator.vibrate(200);
          }
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    // Solicitar permiso en iOS si es necesario
    const requestPermission = async () => {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
          const response = await DeviceMotionEvent.requestPermission();
          if (response === 'granted') {
            window.addEventListener('devicemotion', onDeviceMotion);
          }
        } catch (e) {
          console.error("DeviceMotion permission denied");
        }
      } else {
        window.addEventListener('devicemotion', onDeviceMotion);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('devicemotion', onDeviceMotion);
    };
  }, []);

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

    } catch (error) {
      console.error("Salmi Chat Error:", error);
      setIsTyping(false);
      const errorMsg = "Lo siento, hubo un error procesando la solicitud. Por favor, reintente en unos momentos.";
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: errorMsg,
        sender: 'salmi',
        timestamp: new Date()
      }]);
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
          <span className="salmi-toggle-text">
            ¿Dudas? Pregúntame <br/>
            <small style={{ fontSize: '0.6rem', opacity: 0.8, fontWeight: 500 }}>Agita tu celular</small>
          </span>
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
                  {msg.sender === 'salmi' ? (
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
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
