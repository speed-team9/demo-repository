// src/components/auth/RegisterForm.tsx
import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../services/api';
import { ROLE_ROUTE } from '../../utils/constants';
import styles from './Auth.module.scss';

export const RegisterForm: FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'searcher' as const });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const user = await authAPI.register(form);
    localStorage.setItem('token', user.userId);
    localStorage.setItem('role', user.role);
    void router.replace(ROLE_ROUTE[user.role]);
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <h2>Register</h2>
      <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
        <option value="searcher">Searcher</option>
        <option value="submitter">Submitter</option>
        <option value="moderator">Moderator</option>
        <option value="analyst">Analyst</option>
        <option value="administrator">Administrator</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};