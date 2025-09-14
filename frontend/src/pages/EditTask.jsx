import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditTask(){
  const [form, setForm] = useState({title:'', description:'', status:'todo', priority:'medium', dueDate:'', tags:''});
  const nav = useNavigate();
  const { id } = useParams();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    axios.get(import.meta.env.VITE_API_URL + '/api/tasks/' + id, {
      headers: { 'x-auth-token': token }
    })
    .then(res => {
      const t = res.data;
      setForm({ title: t.title, description: t.description || '', status: t.status, priority: t.priority, dueDate: t.dueDate ? t.dueDate.substring(0,10) : '', tags: t.tags ? t.tags.join(',') : '' });
    })
    .catch(err => console.error(err));
  },[id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {...form, tags: form.tags ? form.tags.split(',').map(t=>t.trim()) : []};
      await axios.put(import.meta.env.VITE_API_URL + '/api/tasks/' + id, payload, {
        headers: { 'x-auth-token': token }
      });
      nav('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating task');
    }
  };

  const remove = async () => {
    if (!confirm('Delete task?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(import.meta.env.VITE_API_URL + '/api/tasks/' + id, {
        headers: { 'x-auth-token': token }
      });
      nav('/');
    } catch (err) {
      alert('Error deleting');
    }
  };

  return (
    <div>
      <h2>Edit Task</h2>
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
        <div style={{display:'flex',gap:8}}>
          <button type="submit">Update</button>
          <button type="button" onClick={remove}>Delete</button>
        </div>
      </form>
    </div>
  );
}
