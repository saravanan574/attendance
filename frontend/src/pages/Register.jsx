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
    if(data.name.trim() == ""){
        setTimeout(() =>setMessage(""),2000 );
        setMessage("Name is required");
        return;
    }
    if(data.email.trim() == ""){
      setTimeout(() =>setMessage(""),2000 );
      setMessage("Email is required");
      return;
  }
  if(data.password.trim() == ""){
    setTimeout(() =>setMessage(""),2000 );
    setMessage("Password is required");
    return;
}
if(data.password.length < 6){
  setTimeout(() =>setMessage(""),2000 );
  setMessage("Password contain minimum six character");
  return;
}
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.status === "success") navigate("/login");
    else {
      setTimeout(() => setMessage(""),2000)
      setMessage(result.message);

    }
  };

  return (
    <div className="card "style = {{maxWidth:"500px",margin:"3px auto",padding:"5px"}}>
      <h2>Student Attendance Management System</h2>
      <Button className="home-btn" bg="red"  onClick={() => navigate("/home")}>
                  Home
                </Button>

      <div className="card" style = {{margin:"3px auto",padding:"5px",textAlign:"center"}}>
      <h3>Create Account</h3>
      <p>{message}</p>
      <Input name="name" type = "text" placeholder="Name" onChange={e => setData({ ...data, name: e.target.value })} />
      <Input name="email" type = "email" placeholder="Email/Unique id" onChange={e => setData({ ...data, email: e.target.value })} />
      <Input name="password" type = "password" placeholder="Password" onChange={e => setData({ ...data, password: e.target.value })} />
      <Button onClick={submit}>Register</Button>
      <p>Already have an account? <Link to="/login" style ={{backgroundColor:"red",color:"white",borderRadius:"10px",padding:"5px 10px"}}>Login</Link></p>
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
