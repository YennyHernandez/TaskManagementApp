import { Link } from 'react-router-dom';

const TaskManager = () => {
    return (
        <div className="task-manager">
            <h1>Manejador de Tareas 📑</h1>
            <div className="container">
                <Link to="/tareas">
                    <button className="btn">Gestionar Tus Tareas</button>
                </Link>
                <Link to="/estados">
                    <button className="btn">Gestionar Tus Estados</button>
                </Link>
            </div>
        </div>
    );
};

export default TaskManager;
