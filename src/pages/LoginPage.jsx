import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState('');
  const [sessionExpired, setSessionExpired] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('sessionExpired')) {
      setSessionExpired(true);
      localStorage.removeItem('sessionExpired');
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: '#181a1b' }}>
      <div className="card bg-dark text-white shadow p-4 mx-auto" style={{ minWidth: 320, maxWidth: 400, width: '100%' }}>
        <div className="text-center mb-3">
          <img src="/juli-logo.svg" alt="Logo" style={{ width: 60, height: 60 }} className="mb-2" />
          <h3 className="fw-bold">Login</h3>
        </div>
        {sessionExpired && (
          <div className="alert alert-warning py-2">Deine Session ist abgelaufen. Bitte melde dich erneut an.</div>
        )}
        {serverError && (
          <div className="alert alert-danger py-2">{serverError}</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">E-Mail</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              id="email"
              {...register('email', { 
                required: 'E-Mail ist erforderlich',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Ungültige E-Mail-Adresse'
                }
              })}
            />
            {errors.email && <div className="text-danger mt-1">{errors.email.message}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Passwort</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              id="password"
              {...register('password', { required: 'Passwort ist erforderlich' })}
            />
            {errors.password && <div className="text-danger mt-1">{errors.password.message}</div>}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Lädt...' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
} 