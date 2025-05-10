import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/layout';
import HomePage from './pages/Home/Home'; 
import AboutPage from './pages/About/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;