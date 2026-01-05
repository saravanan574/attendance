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
    if(localStorage.getItem("token")){
      navigate("/attendance");
    }
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
    <div className="card"  style = {{maxWidth:"500px",margin:"3px auto",padding:"5px"}}>
      <h2 style={{textAlign:"center"}}  > Attendance Management System</h2>
      <Button className="home-btn" bg="red"  onClick={() => navigate("/home")}>
                  Home
                </Button>

      <div className="card" style = {{padding:"4px",textAlign:"center"}} >
      <h2>Login</h2>
      <p>{message}</p>
      <Input type="email" placeholder="Email/Unique id" onChange={e => setData({ ...data, email: e.target.value })} />
      <Input type="password" placeholder="Password" onChange={e => setData({ ...data, password: e.target.value })} />
      <Button onClick={submit}>Login</Button>
      <p>Don’t have an account? 
        
      <Button variant="att-btn" bg="#190f1f" col="white"  onClick={() => navigate("/register")}>
                  Register
                </Button></p>
      </div>
      <div className="dashboard-card">
      <p>
  This system allows students to track their attendance on a day-to-day basis.
  Attendance records are updated by the student and reflected instantly
  in percentage calculations.
</p>

<ul>
  <li>Mark attendance daily as Present, Absent, or Holiday</li>
  <li>Edit mistakenly updated attendance using history edit mode</li>
  <li>Filter attendance by Present, Absent, and Holiday</li>
  <li>Attendance percentage is indicative, not guaranteed</li>
  <li>Use the attendance calculator to plan for 75% eligibility</li>
</ul>
      </div>
    </div>
  );
}
