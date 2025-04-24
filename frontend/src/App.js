import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import logo from '../src/assets/jafaco.png';
import "./styles.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <nav className="nav-container">
        <div className="nav-content">
          <Link to="/" className="brand">
          <img src={logo} alt="Logo" className="logo" />
            <span className="brand-text">JaFaço</span>
          </Link>
          
          <div className="nav-links">
            {isAuthenticated && (
              <Link to="/tasks/create" className="nav-link">Nova Tarefa</Link>
            )}
            {isAuthenticated ? (
              <button 
                className="logout-btn"
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsAuthenticated(false);
                }}
              >
                Sair
              </button>
            ) : (
              <>
                <Link to="/login" className="nav-link">Entrar</Link>
                <Link to="/register" className="nav-link register-link">Criar Conta</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/tasks" />} />
        <Route path="/register" element={!isAuthenticated ? <Register setAuth={setIsAuthenticated} /> : <Navigate to="/tasks" />} />
        <Route path="/tasks" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
        <Route path="/tasks/create" element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} />
        <Route path="/tasks/edit/:id" element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;