"use client";

import {useState,useEffect}  from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import {useNavigate} from "react-router-dom";

export default function Login(){
    const API = "https://attendance-um8v.onrender.com"
    const navigate = useNavigate();
    const [data,setData] = useState({email:"",password:""});
    const [message,setMessage] = useState("");


    useEffect(() =>{
        const check = async() =>{
            if(localStorage.getItem("token") != null){
                navigate("/attendance");
            }
        }
        check();
    },[])
    const submit = async() => {
        if( data.email.trim() == ""  || data.password.trim() == ""){
            setMessage("Please fill all the fields!");
            setTimeout(() => setMessage(""),2000);
            return;
        }
        try{
            const res = await fetch(`${API}/login`,{
                method:"POST",
                credentials:"include",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            });
            const result = await res.json();
            if(result.status == "success"){
                localStorage.setItem("token",result.token);
                navigate("/attendance");
            }
            else{
                setMessage(result.message);
                setTimeout(() => setMessage(""),3000);
            }
        }   
        catch(err){
            setMessage("Something is wrong. Please try again later");
            setTimeout(() => setMessage(""),2000);
        }
    }

    return (
        <div className = "card form-card">
            <h2>Login</h2>
            <p>{message}</p>
            <Input name = "email" type = "email" placeholder = "Email"
                onChange = {(e) => setData({...data,email:e.target.value})}
            />
            <Input name = "password" type = "password" placeholder = "Password"
                onChange = {(e) => setData({...data,password:e.target.value})}
            />
            <Button onClick = {submit}>Login</Button>
            <p>Don't have an account ?
                <Link className="Link" to ="/register">Register</Link>
            </p>
        </div>
        
    )
}
