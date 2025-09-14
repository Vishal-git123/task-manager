import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home(){
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status:'', priority:'', tag:'', sortBy:''});

  const fetch = () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    axios.get(import.meta.env.VITE_API_URL + '/api/tasks?' + params.toString(), {
      headers: { 'x-auth-token': token }
    })
      .then(res => setTasks(res.data))
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          // not logged in
          setTasks([]);
        }
      });
  };

  useEffect(()=>{ fetch(); }, [filters]);

  return (
    <div>
      <h1>Your Tasks</h1>

      <div className="filters">
        <select value={filters.status} onChange={e=>setFilters({...filters, status:e.target.value})}>
          <option value=''>All Status</option>
          <option value='todo'>To Do</option>
          <option value='in-progress'>In Progress</option>
          <option value='done'>Done</option>
        </select>

        <select value={filters.priority} onChange={e=>setFilters({...filters, priority:e.target.value})}>
          <option value=''>All Priority</option>
          <option value='low'>Low</option>
          <option value='medium'>Medium</option>
          <option value='high'>High</option>
        </select>

        <input placeholder="Tag" value={filters.tag} onChange={e=>setFilters({...filters, tag:e.target.value})} />
        <select value={filters.sortBy} onChange={e=>setFilters({...filters, sortBy:e.target.value})}>
          <option value=''>Sort By</option>
          <option value='dueDate'>Due Date</option>
          <option value='priority'>Priority</option>
        </select>

        <button onClick={fetch}>Apply</button>
      </div>

      {tasks.length === 0 ? <p>No tasks found or you are not logged in.</p> : tasks.map(t=>(
        <div className="task" key={t._id}>
          <div>
            <h3>{t.title}</h3>
            <div className="meta">Priority: {t.priority} • Status: {t.status} • Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</div>
            <p>{t.description}</p>
            <div className="meta">Tags: {t.tags?.join(', ')}</div>
          </div>
          <div>
            <Link to={'/edit/' + t._id}>Edit</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
