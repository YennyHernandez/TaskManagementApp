import { useEffect, useState } from 'react';

const StateManager = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [states, setStates] = useState([]); // Almacena los estados
    const [newStateName, setNewStateName] = useState(''); // Almacena el nombre del nuevo estado
    const [error, setError] = useState(null); // Para manejar errores

    // Almacena el estado actualmente en edición
    const [isEditing, setIsEditing] = useState(false);
    const [currentStateId, setCurrentStateId] = useState(null);
    const [editStateName, setEditStateName] = useState('');

    // Función para obtener los estados
    const fetchStates = async () => {
        try {
            const response = await fetch(apiUrl + '/api/state');
            if (!response.ok) {
                throw new Error('Error al obtener los estados');
            }
            const data = await response.json();
            setStates(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Función para crear un nuevo estado
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiUrl + '/api/state', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stateName: newStateName,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el estado');
            }

            const newState = await response.json();
            setStates((prevStates) => [...prevStates, newState]); // Añade el nuevo estado a la lista
            alert("¡Tu estado fue creado!")
            setNewStateName('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Función para eliminar estado
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/state/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el estado');
            }

            setStates((prevStates) => prevStates.filter((state) => state.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // Función para iniciar la edición de un estado
    const startEditing = (state) => {
        setIsEditing(true);
        setCurrentStateId(state.id);
        setEditStateName(state.stateName);
    };
     // Función para cancelar la edición de una estado
     const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentStateId(null);
        setEditStateName('');
    };
    // Función para manejar la actualización de un estado
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/api/state/${currentStateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentStateId,
                    stateName: editStateName,
                }),
            });

            console.log('status:', response.status);
            if (response.status === 204) {
                setStates((prevStates) =>
                    prevStates.map((state) =>
                        state.id === currentStateId ? { ...state, stateName: editStateName } : state
                    )
                );

                // Restablecer el estado de edición
                setIsEditing(false);
                setCurrentStateId(null);
                setEditStateName('');
                return;
            }

            if (!response.ok) {
                throw new Error('Error al actualizar el estado');
            }

        } catch (err) {
            console.error('Caught error:', err);
            setError(err.message);
        }
    };


    useEffect(() => {
        fetchStates();
    }, []);

    return (
        <div>
            <h1>Gestión de estados</h1>
            {error && <p>{error.message || 'Ocurrió un error'}</p>}
            <h2>Crear estado nuevo</h2>
            <form onSubmit={handleSubmit} className='container'>
                <input
                    type="text"
                    placeholder="Nombre del nuevo estado"
                    value={newStateName}
                    required
                    onChange={(e) => setNewStateName(e.target.value)}
                    className='shape-input'
                />
                <button type="submit">Crear ➕</button>
            </form>
            <h2>Lista de Estados Actuales</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre de tus estados</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {states.length === 0 ? (
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'center' }}>
                                No tienes estados creados
                            </td>
                        </tr>
                    ) : (
                        states.map((state) => (
                            <tr key={state.id}>
                                <td>
                                    {isEditing && currentStateId === state.id ? (
                                        <input
                                            type="text"
                                            value={editStateName}
                                            onChange={(e) => setEditStateName(e.target.value)}
                                        />
                                    ) : (
                                        <span>{state.stateName}</span>
                                    )}
                                </td>
                                <td>
                                    {isEditing && currentStateId === state.id ? (
                                        <div className='container'>
                                            <button onClick={handleUpdate}>Actualizar ✔️</button>
                                            <button onClick={handleCancelEdit}>Cancelar ✖️</button>
                                        </div>                                        
                                    ) : (
                                        <div className='container'>
                                            <button onClick={() => startEditing(state)}>Editar ✏️</button>
                                            <button onClick={() => handleDelete(state.id)}>Eliminar 🗑️</button>
                                        </div>
                                        
                                    )}
                                    
                                </td>
                            </tr>
                        ))
                    )}

                </tbody>

            </table>
        </div>
    );
};

export default StateManager;
