import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AdminProducts from './pages/AdminProducts';
import AdminStock from './pages/AdminStock';
import ChatbotOrdering from './pages/ChatbotOrdering';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ChatbotOrdering />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/stock" element={<AdminStock />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
