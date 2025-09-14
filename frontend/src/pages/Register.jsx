import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({name:'', email:'', password:''});
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form className="form" onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
