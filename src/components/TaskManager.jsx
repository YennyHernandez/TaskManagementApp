import { useEffect, useState } from 'react';

const TaskManager = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
    const [taskName, setTaskName] = useState('');
    const [taskState, setTaskState] = useState('');
    const [states, setStates] = useState([]); // Estado para almacenar los estados generales
    const [error, setError] = useState(null); // Para manejar errores
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [editTaskName, setEditTaskName] = useState('');
    const [editTaskState, setEditTaskState] = useState(''); // Estado de la tarea en edición

    // Función para obtener la lista de estados
    const fetchStates = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/task/listStates`);
            if (!response.ok) {
                throw new Error('Error al obtener los estados');
            }
            const data = await response.json();
            setStates(data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Función para obtener la lista de tareas
    const fetchTasks = async () => {
        try {
            const response = await fetch(apiUrl + '/api/task');
            if (!response.ok) {
                throw new Error('Error al obtener las tareas');
            }
            const tasksData = await response.json();
            // Combinar tareas con nombres de estado
            const tasksWithStates = tasksData.map(task => {
                const state = states.find(s => s.id === task.stateId);
                return {
                    ...task,
                    stateName: state ? state.stateName : 'Fue eliminado ⚠️'
                };
            });

            setTasks(tasksWithStates);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchStates();
    }, []);
    
    useEffect(() => {
        fetchTasks();
    }, [states]);

    // Función para manejar el envío del formulario de creación
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(apiUrl + '/api/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: taskName,
                    stateId: parseInt(taskState), // ID del estado seleccionado
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Actualiza la lista de tareas después de crear una nueva tarea
            await fetchTasks();
            alert("¡tu tarea fue creada!")
            // Limpia los campos del formulario
            setTaskName('');
            setTaskState('');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    // Función para eliminar una tarea
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/task/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la tarea');
            }

            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Función para iniciar la edición de una tarea
    const startEditing = (task) => {
        setIsEditing(true);
        setCurrentTaskId(task.id);
        setEditTaskName(task.title);
        setEditTaskState(task.stateId); // Setea el estado actual en edición
    };
    
    // Función para cancelar la edición de una tarea
    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentTaskId(null);
        setEditTaskName('');
        setEditTaskState(''); // Reinicia el estado del editor
    };

    // Función para manejar la actualización de una tarea
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/api/task/${currentTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentTaskId,
                    title: editTaskName,
                    stateId: parseInt(editTaskState), // Usa el estado actualizado
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la tarea');
            }

            // Actualiza la lista de tareas después de la actualización
            await fetchTasks();
            // Restablece el estado de edición
            setIsEditing(false);
            setCurrentTaskId(null);
            setEditTaskName('');
            setEditTaskState('');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div>
            <div>
                {error && <p>{error.message || 'Ocurrió un error'}</p>}
                <h1>Gestion de Tareas</h1>
                <h2>Crear nueva tarea</h2>
                <form onSubmit={handleSubmit} className='container'>
                    <input
                        type="text"
                        placeholder="Nombre de la tarea"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                        className='shape-input'
                    />
                    <select value={taskState}
                        onChange={(e) => setTaskState(e.target.value)}
                        required
                        className='shape-select'>
                        <option value="" disabled>
                            Selecciona un estado
                        </option>
                        {states.map((state) => (
                            <option key={state.id} value={state.id}>
                                {state.stateName}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Crear ➕</button>
                </form>
            </div>
            <h2>Lista de Tareas</h2>
            {tasks.length === 0 ? (
                <p>No tiene tareas creadas.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Título de la Tarea</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td>
                                    {isEditing && currentTaskId === task.id ? (
                                        <input
                                            type="text"
                                            value={editTaskName}
                                            onChange={(e) => setEditTaskName(e.target.value)}
                                        />
                                    ) : (
                                        task.title
                                    )}
                                </td>
                                <td>
                                    {isEditing && currentTaskId === task.id ? (
                                        <select value={editTaskState} onChange={(e) => setEditTaskState(e.target.value)}>
                                            {states.map((state) => (
                                                <option key={state.id} value={state.id}>
                                                    {state.stateName}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        task.stateName
                                    )}
                                </td>
                                <td>
                                    {isEditing && currentTaskId === task.id ? (
                                        <div className='container'>
                                            <button onClick={handleUpdate}>Actualizar ✔️</button>
                                            <button onClick={handleCancelEdit}>Cancelar ✖️</button>
                                        </div>
                                    ) : (
                                        <div className='container'>
                                            <button onClick={() => startEditing(task)}>Editar ✏️</button>
                                            <button onClick={() => handleDelete(task.id)}>Eliminar 🗑️</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
};

export default TaskManager;
