import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/attendance");
  }, []);

  const submit = async () => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.status === "success") {
      localStorage.setItem("token", result.token);
      navigate("/attendance");
    } else setMessage(result.message);
  };

  return (
    <div className="card form-card">
      <h2>Login</h2>
      <p>{message}</p>
      <Input type="email" placeholder="Email" onChange={e => setData({ ...data, email: e.target.value })} />
      <Input type="password" placeholder="Password" onChange={e => setData({ ...data, password: e.target.value })} />
      <Button onClick={submit}>Login</Button>
      <p>Don’t have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
