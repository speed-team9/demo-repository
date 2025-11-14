/* eslint-disable react/no-unescaped-entities */
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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f7fb',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        backgroundColor: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{
          marginBottom: '24px',
          color: '#1a365d',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          Login
        </h2>
        
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            placeholder="Username"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{
              padding: '14px',
              fontSize: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              width: '92.5%'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4299e1'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          
          <input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{
              padding: '14px',
              fontSize: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              width: '92.5%'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4299e1'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          
          <button
            type="submit"
            style={{
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              marginTop: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2b6cb0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3182ce'}
          >
            Login
          </button>
        </form>

        <button
          onClick={() => router.push('/register')}
          style={{
            marginTop: '20px',
            padding: '10px',
            fontSize: '14px',
            backgroundColor: 'transparent',
            color: '#3182ce',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            textDecoration: 'underline',
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#2b6cb0'}
          onMouseOut={(e) => e.currentTarget.style.color = '#3182ce'}
        >
          Don't have an account? Register here
        </button>
      </div>
    </div>
  );
};