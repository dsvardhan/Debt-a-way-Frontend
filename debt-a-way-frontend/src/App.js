import React from 'react';
import axios from 'axios'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginRegister from './LoginRegister';
import Home from './Home';
import DebtsOwed from './DebtsOwed';
import DebtsReceivable from './DebtsReceivable';
import Wallet from './Wallet';
import './App.css';

// Import additional components or hooks as needed

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('userToken');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

function App() {
  const isAuthenticated = false; // Replace this with actual authentication logic
  const userToken = localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/debts-owed" element={<DebtsOwed/>} />
        <Route path="/debts-receivable" element={<DebtsReceivable/>} />
        <Route path="/wallet" element={<Wallet/>} />
        {/* Define other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
