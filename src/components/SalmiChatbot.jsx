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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Lo siento, tuve un pequeño tropiezo digital. ¿Me lo puedes volver a preguntar?",
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
            <div className="salmi-header-actions">
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
