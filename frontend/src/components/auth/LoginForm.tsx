// src/components/auth/LoginForm.tsx
import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../services/api';
import { ROLE_ROUTE } from '../../utils/constants';
import styles from './Auth.module.scss';

export const LoginForm: FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const user = await authAPI.login(form);
    localStorage.setItem('token', user.userId);
    localStorage.setItem('role', user.role);
    void router.replace(ROLE_ROUTE[user.role]);
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <h2>Login</h2>
      <input
        placeholder="Username"
        required
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};