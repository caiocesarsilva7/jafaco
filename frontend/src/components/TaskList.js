import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaskService from './TaskService';
import "./TaskStyle.css"
import { format } from 'date-fns';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await TaskService.getAllTasks();
      setTasks(response.data);
    } catch (error) {
      setError('Erro ao carregar tarefas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      TaskService.deleteTask(id)
        .then(() => fetchTasks())
        .catch(error => setError('Erro ao excluir tarefa: ' + error.message));
    }
  };

  const handleToggleComplete = (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    TaskService.updateTask(task.id, updatedTask)
      .then(() => fetchTasks())
      .catch(error => setError('Erro ao atualizar tarefa: ' + error.message));
  };

  if (loading) return <div className="text-center mt-5">Carregando tarefas...</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Minhas Tarefas</h1>
        <Link to="/tasks/create" className="btn btn-primary">Nova Tarefa</Link>
      </div>

      <div className="task-list">
        <h2>Lista de Tarefas</h2>
        {tasks.length === 0 ? (
          <div className="no-tasks">Você ainda não tem tarefas.</div>
        ) : (
          <ul>
            {tasks.map(task => (
            <li key={task.id}>
            <div className="task-check">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
                id={`task-${task.id}`}
              />
              <div className="task-check-content">
                <h5 className={task.completed ? 'text-decoration-line-through' : ''}>
                  {task.title}
                </h5>
                <p>{task.description}</p>
              </div>
            </div>
          
            <div className="task-actions">
              {task.dueDate && (
                <span className="task-status status-pending">
                  Vence em: {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                </span>
              )}
              <Link to={`/tasks/edit/${task.id}`} className="icon-btn">✏️</Link>
              <button className="icon-btn delete" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
            </div>
          </li>          
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskList;
