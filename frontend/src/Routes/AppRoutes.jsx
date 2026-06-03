import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../Layouts/PublicLayout';
import DashboardLayout from '../Layouts/DashboardLayout';

// Pages
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import Dashboard from '../Pages/Dashboard';
import AlumniDirectory from '../Pages/AlumniDirectory';
import AlumniProfile from '../Pages/AlumniProfile';
import Events from '../Pages/Events';
import Messages from '../Pages/Messages';
import Contact from '../Pages/Contact';
import AdminDashboard from '../Pages/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/directory" element={<AlumniDirectory />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<AlumniProfile />} />
        <Route path="/profile/:id" element={<AlumniProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
