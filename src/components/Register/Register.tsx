import React, { useState } from 'react';
import styles from './Register.module.css';
import PasswordStrengthMeter from '../PasswordStrength/PasswordStrengthMeter';

interface RegisterProps {
  onRegister: (credentials: { username: string; email: string; password: string }) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert('Tots els camps son obligatoris');
    onRegister({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Nom d'usuari:
        <input
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
      </label>
      <label>
        Correu electrònic:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      {password && <PasswordStrengthMeter password={password} />}
      </label>
      <button type="submit" className={styles.button}>Registrar</button>
    </form>
  );
};

export default Register;
