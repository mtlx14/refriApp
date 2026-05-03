import { useState } from 'react';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch {
      setError('Email o contraseña incorrectos');
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Ingresar</h1>
      <Input label="Email" type="email" value={email} onChange={setEmail} />
      <Input label="Contraseña" type="password" value={password} onChange={setPassword} />
      {error && <span className={styles.error}>{error}</span>}
      <Button type="submit" fullWidth disabled={submitting || !email || !password}>
        {submitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
};
