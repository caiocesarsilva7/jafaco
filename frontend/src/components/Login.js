import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import "../styles.css";

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsLoading(true);
      const { token } = await login(formData);
      localStorage.setItem('token', token);
      console.log('Token recebido:', token);
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Bem-vindo de volta! 👋</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="username"
            placeholder="username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="decorative-line">
        <span>OU</span>
      </div>

      <div className="social-login">
        <button className="social-button" type="button">
          <FcGoogle size={20} />
          Continuar com Google
        </button>
        <button className="social-button" type="button">
          <FaGithub size={20} />
          Continuar com GitHub
        </button>
      </div>

      <div className="auth-link">
        Não tem conta? <Link to="/register">Cadastre-se aqui</Link>
      </div>
    </div>
  );
};

export default Login;