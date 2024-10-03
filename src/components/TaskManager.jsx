import { useEffect, useState } from 'react';

const TaskManager = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [activeTab, setActiveTab] = useState('list');
    const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
    const [loading, setLoading] = useState(true); // Estado para controlar la carga
    const [taskName, setTaskName] = useState('');
    const [taskState, setTaskState] = useState('');
    const [states, setStates] = useState([]); // Estado para almacenar los estados
    const [error, setError] = useState(null); // Para manejar errores

    // Función para obtener la lista de tareas
    const fetchTasks = async () => {
        try {
            const response = await fetch(apiUrl + '/api/task');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

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
            console.error('Error fetching states:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchStates();
    }, []);

    // Función para manejar el envío del formulario
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
                    stateId: parseInt(taskState), // El ID del estado seleccionado
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Actualiza la lista de tareas después de crear una nueva tarea
            await fetchTasks();
            // Limpia los campos del formulario
            setTaskName('');
            setTaskState('');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div>
            <h1>Gestión de Tareas</h1>
            <div>
                <button onClick={() => setActiveTab('list')} style={{ marginRight: '10px' }}>
                    Lista de Tareas
                </button>
                <button onClick={() => setActiveTab('create')}>
                    Crear Tarea
                </button>
            </div>

            {activeTab === 'list' && (
                <div>
                    <h2>Lista de Tareas</h2>
                    {loading ? (
                        <p>Cargando tareas...</p>
                    ) : tasks.length === 0 ? (
                        <p>No tiene tareas creadas.</p>
                    ) : (
                        <ul>
                            {tasks.map((task) => (
                                <li key={task.id}>
                                    {task.title} - Estado: {task.stateId}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {activeTab === 'create' && (
                <div>
                    <h2>Crear Tarea</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nombre de la tarea"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            required
                        />
                        <select value={taskState} onChange={(e) => setTaskState(e.target.value)} required>
                            <option value="" disabled>
                                Selecciona un estado
                            </option>
                            {states.map(state => (
                                <option key={state.id} value={state.id}>
                                    {state.stateName}
                                </option>
                            ))}
                        </select>
                        <button type="submit">Crear Tarea</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TaskManager;
