import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskService from './TaskService';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [task, setTask] = useState({
    title: '',
    description: '',
    completed: false,
    dueDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      TaskService.getTaskById(id)
        .then(response => {
          const taskData = response.data;
          if (taskData.dueDate) {
            const dueDate = new Date(taskData.dueDate);
            taskData.dueDate = dueDate.toISOString().split('T')[0];
          }
          setTask(taskData);
          setLoading(false);
        })
        .catch(error => {
          setError('Erro ao carregar tarefa: ' + error.message);
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const taskData = { ...task };
    if (taskData.dueDate) {
      taskData.dueDate = new Date(taskData.dueDate + 'T23:59:59').toISOString();
    }

    const saveTask = isEditMode
      ? TaskService.updateTask(id, taskData)
      : TaskService.createTask(taskData);

    saveTask
      .then(() => navigate('/tasks'))
      .catch(error => {
        setError('Erro ao salvar tarefa: ' + error.message);
        setLoading(false);
      });
  };

  if (loading && isEditMode) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  return (
    <div className="app-container">
      <div className="task-form">
        <h2>{isEditMode ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={task.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Data de Vencimento</label>
            <input
              type="date"
              className="form-control"
              id="dueDate"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
            />
          </div>

          {isEditMode && (
            <div className="form-group">
              <label htmlFor="completed">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="completed"
                  name="completed"
                  checked={task.completed}
                  onChange={handleChange}
                /> Concluída
              </label>
            </div>
          )}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/tasks')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;