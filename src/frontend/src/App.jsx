import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import Disruptions from './pages/Disruptions';
import RoutesPage from './pages/Routes';
import Fleet from './pages/Fleet';
import ColdChain from './pages/ColdChain';
import AiAssistant from './pages/AiAssistant';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shipments" element={<Shipments />} />
        <Route path="/disruptions" element={<Disruptions />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/cold-chain" element={<ColdChain />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

