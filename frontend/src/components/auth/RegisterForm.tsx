// src/components/auth/RegisterForm.tsx
import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../services/api';
import { ROLE_ROUTE } from '../../utils/constants';

export const RegisterForm: FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'searcher' as const });

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.username.length > 20) {
      alert('Username must be no more than 20 characters long.');
      return;
    }

    if (form.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      const user = await authAPI.register(form);
      localStorage.setItem('token', user.userId);
      localStorage.setItem('role', user.role);
      void router.replace(ROLE_ROUTE[user.role]);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        alert('Username already exists.');
      }
    }
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
          Register
        </h2>
        
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as any })}
            style={{
              padding: '14px',
              fontSize: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              width: '100%'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4299e1'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="searcher">Searcher</option>
            <option value="submitter">Submitter</option>
            <option value="moderator">Moderator</option>
            <option value="analyst">Analyst</option>
            <option value="administrator">Administrator</option>
          </select>
          
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
            Register
          </button>
        </form>

        <button
          onClick={() => router.push('/login')}
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
          Already have an account? Login here
        </button>
      </div>
    </div>
  );
};