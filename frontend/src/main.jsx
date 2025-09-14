import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';

import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/create">Create Task</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/edit/:id" element={<EditTask />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
