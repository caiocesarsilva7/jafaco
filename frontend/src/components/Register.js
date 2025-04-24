import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        username: formData.username,
        password: formData.password
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { registered: true } });
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Erro no registro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Criar Conta</h2>
      
      {success && (
        <div className="success">
          ✅ Registro bem-sucedido! Redirecionando para login...
        </div>
      )}

      {error && <div className="error">❌ {error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nome de usuário"
          value={formData.username}
          onChange={handleInputChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirme a Senha"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Criar Conta'}
        </button>
      </form>

      <div className="auth-link">
        Já tem uma conta? <Link to="/login">Faça login aqui</Link>
      </div>
    </div>
  );
};

export default Register;