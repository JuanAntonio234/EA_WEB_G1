import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/layout';
import HomePage from './pages/Home/HomePage'; 
import AboutPage from './pages/About/AboutPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ActivitiesPage from './pages/Activities/ActivitiesPage';
import ProfilePage from './pages/Profile/ProfilePage';

import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/activities" element={<Layout><ActivitiesPage /></Layout>} />
        <Route path="/profile/:iduser" element={<Layout><ProfilePage /></Layout>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;