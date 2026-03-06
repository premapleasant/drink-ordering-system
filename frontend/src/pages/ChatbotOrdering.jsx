import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Mic, MicOff, Coffee } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const ChatbotOrdering = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to SipSync AI! ☕ What can I get for you today? Type "menu" to see available drinks or simply say what you want.' }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [products, setProducts] = useState([]);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  useEffect(() => {
    fetchProducts();
    setupSpeechRecognition();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products for menu');
    }
  };

  const setupSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  };

  const speak = (text) => {
    if (synth) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      synth.speak(utterance);
    }
  };

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
    if (sender === 'bot') {
      speak(text);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        alert("Voice input is not supported by your browser.");
      }
    }
  };

  const handleSend = async (textOveride = '') => {
    const textToSend = typeof textOveride === 'string' && textOveride ? textOveride : input;
    if (!textToSend.trim()) return;

    // Add user message to UI
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInput('');

    const lowerInput = textToSend.toLowerCase();

    // Command: Menu/Available
    if (lowerInput.includes('menu') || lowerInput.includes('available') || lowerInput.includes('options')) {
      await fetchProducts();
      if (products.length === 0) {
         addMessage('bot', "Our menu is currently empty. Please check back later.");
         return;
      }
      const menuText = products
        .map(p => `${p.name} ($${Number(p.price).toFixed(2)}) - ${p.stock_quantity > 0 ? p.stock_quantity + ' left' : 'Out of stock'}`)
        .join(', ');
      addMessage('bot', `Here is our menu: ${menuText}. What would you like to order?`);
      return;
    }

    // Command: Order logic processing
    // Let's see if the text matches any product name
    let foundProduct = null;
    for (const p of products) {
        if (lowerInput.includes(p.name.toLowerCase())) {
            foundProduct = p;
            break;
        }
    }

    if (foundProduct) {
        // Try placing the order (default qty 1 for simplicity in text)
        try {
            const res = await axios.post(`${API_URL}/orders`, {
                productId: foundProduct.id,
                quantity: 1
            });
            addMessage('bot', `Success! ${res.data.message}. You've ordered 1 ${foundProduct.name}. Final confirmation complete.`);
        } catch (error) {
            if (error.response && error.response.status === 400) {
               addMessage('bot', `I'm sorry, we don't have enough stock for ${foundProduct.name}. ${error.response.data.message}`);
            } else {
               addMessage('bot', `Oops, something went wrong while processing your order for ${foundProduct.name}. Please try again.`);
            }
        }
    } else {
        // Did not understand
        addMessage('bot', "I couldn't identify a drink from your message. Try saying 'menu' to see what's available, or specify the exact drink name you want.");
    }
  };

  return (
    <div className="animation-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h2>Chatbot Ordering</h2>
        <p>Order your drinks by typing or using your voice.</p>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-area" style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
             <button 
                className={`mic-btn ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecording}
                title="Use Voice"
             >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
             </button>
             <input 
                type="text" 
                className="input-field" 
                style={{ flex: 1 }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your order or ask for the menu..."
             />
             <button className="btn btn-primary" onClick={() => handleSend()}>
                <Send size={18} />
             </button>
          </div>
        </div>
      </div>
      
      {/* Quick Menu Overview */}
      <div className="products-grid">
        {products.map(p => (
           <div key={p.id} className="product-item" onClick={() => { setInput(`I want 1 ${p.name}`); }}>
              <Coffee size={24} style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }} />
              <div style={{ fontWeight: 'bold' }}>{p.name}</div>
              <div className="price">${Number(p.price).toFixed(2)}</div>
              <div style={{ fontSize: '0.8rem', color: p.stock_quantity > 0 ? 'var(--text-secondary)' : 'var(--danger)', marginTop: '0.5rem' }}>
                  {p.stock_quantity > 0 ? `${p.stock_quantity} available` : 'Out of stock'}
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default ChatbotOrdering;
