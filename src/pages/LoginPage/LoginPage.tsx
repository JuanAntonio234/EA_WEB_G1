import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage';
import Button from '../../components/Button/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Lógica de Login (pendiente de API)
    console.log('Login attempt:', { email, password });
    alert('Login no implementado. Redirigiendo a perfil (simulado)');
    // Simular login exitoso y redirigir
    // localStorage.setItem('authToken', 'fake-token'); // Simular token
    // navigate('/profile/me');
  };

  return (
    <div className="login-page container">
      <div className="login-form-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="primary">
            Entrar
          </Button>
        </form>
        <p className="form-switch-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;