import { Link } from 'react-router-dom';

const TaskManager = () => {
    return (
        <div className="task-manager">
            <h1>Manejador de Tareas 📑</h1>
            <div className="button-container">
                <Link to="/tareas">
                    <button className="btn">Gestionar Tareas</button>
                </Link>
                <Link to="/estados">
                    <button className="btn">Gestionar Estados</button>
                </Link>
            </div>
        </div>
    );
};

export default TaskManager;
