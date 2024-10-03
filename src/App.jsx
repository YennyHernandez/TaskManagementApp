
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StateManager from './components/stateManager';
import TaskManager from './components/taskManager';

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="tareas" element={<TaskManager/>}/>
                <Route path="estados" element={<StateManager/>} />
            </Routes>
        </>

    );

};

export default App;
