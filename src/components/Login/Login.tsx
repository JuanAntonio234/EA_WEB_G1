import React, { useState } from 'react';
import styles from './Login.module.css';

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert('Correu electrònic i contrasenya son obligatoris');
    onLogin({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Correu electrònic:
        <input
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
      </label>
      <label>
        Contrasenya:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
      </label>
      <button type="submit" className={styles.button}>Entrar</button>
    </form>
  );
};

export default Login;
