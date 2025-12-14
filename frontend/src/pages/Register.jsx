import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const submit = async () => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.status === "success") navigate("/login");
    else setMessage(result.message);
  };

  return (
    <div className="card form-card">
      <h3>Create Account</h3>
      <p>{message}</p>
      <Input name="name" placeholder="Name" onChange={e => setData({ ...data, name: e.target.value })} />
      <Input name="email" placeholder="Email" onChange={e => setData({ ...data, email: e.target.value })} />
      <Input name="password" placeholder="Password" onChange={e => setData({ ...data, password: e.target.value })} />
      <Button onClick={submit}>Register</Button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
