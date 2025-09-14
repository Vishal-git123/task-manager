import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateTask(){
  const [form, setForm] = useState({title:'', description:'', status:'todo', priority:'medium', dueDate:'', tags:''});
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {...form, tags: form.tags ? form.tags.split(',').map(t=>t.trim()) : []};
      await axios.post(import.meta.env.VITE_API_URL + '/api/tasks', payload, {
        headers: { 'x-auth-token': token }
      });
      nav('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error creating task');
    }
  };

  return (
    <div>
      <h2>Create Task</h2>
      <form className="form" onSubmit={submit}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} />
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
