import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import MainLayout from './layouts/MainLayout'; 
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import ActivityDetailPage from './pages/ActivityDetailPage/ActivityDetailPage'; 
import LogActivityPage from './pages/LogActivityPage/LogActivityPage';     

import './App.css';

const App: React.FC = () => {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} /> 
          <Route path="about" element={<AboutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile/me" element={<UserProfilePage isMyProfile={true} />} /> 
          <Route path="profile/:userId" element={<UserProfilePage />} /> 
        
          <Route path="activity/:activityId" element={<ActivityDetailPage />} />
          <Route path="log-activity" element={<LogActivityPage />} />

          {/* TODO: Más adelante puedes añadir aquí una ruta para "Página no encontrada" (404) */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
