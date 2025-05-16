import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const HomePage: React.FC = () => {
    const { user } = useAuth();
console.log('User en componente:', user);

    
  if (!user) {
    return <p>No has iniciado sesión.</p>;
  }
  return (
    <div>
      <h1>Bienvenido a la Página de Inicio</h1>
      <h1>Bienvenido a la Página de Inicio</h1>
      <h1>Bienvenido a la Página de Inicio</h1>
      <h1>Bienvenido a la Página de Inicio</h1>
      <h1>Bienvenido a la Página de Inicio</h1>
      <h1>Bienvenido a la Página de Inicio</h1>
      <h1>Bienvenido a la Página de Inicio</h1>
      <h1>Bienvenido a la Página de Inicio</h1>
      <h1>Bienvenido a la Página de Inicio</h1>
      <h1>Bienvenido a la Página de Inicio</h1>
    <h2>Bienvenido, {user?.username }</h2>

    </div>
  );
};

export default HomePage;