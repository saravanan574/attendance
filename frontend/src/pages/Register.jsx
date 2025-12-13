import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import {useNavigate} from "react-router-dom"
export default function Register(){
    const API = "https://attendance-um8v.onrender.com"
    const navigate = useNavigate();
    const [data,setData] = useState({name:"",email:"",password:""});
    const [message,setMessage] = useState("");
    useEffect(() =>{
        if(localStorage.getItem("token")){
            navigate("/attendance");
        }
    })
    const handleChange = (e) =>{
        const {name,value} = e.target;
        setData({
            ...data,[name]:value
        })
    };

    const submit = async() => {
        if(data.name.trim() == "" || data.email.trim() == ""  || data.password.trim() == ""){
            setMessage("Please fill all the fields!");
            setTimeout(() => setMessage(""),2000);
            return;
        }
        try{
            const res = await fetch(`${API}/register`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            });

            const result = await res.json();
            if(result.status == "success"){
                navigate("/login");
            }
            else{
                setMessage(result.message)
                setTimeout(() => setMessage(""),2000);
            }
        }   
        catch(err){
            setMessage("Something is wrong<\nPlease try again later");
            setTimeout(() => setMessage(""),2000);
        }
    }

    return (
            <div className="card form-card">
                <h3>Create Account</h3>
                <p >{message}</p>
                <Input name = "name" type = "text" placeholder = "Name" 
                    onChange = {handleChange}
                />
                <Input name = "email" type = "email" placeholder = "Email"
                    onChange = {handleChange}
                />
                <Input name = "password" type = "password" placeholder = "Password"
                    onChange = {handleChange}
                />
                <Button onClick = {submit}>Register</Button>
                <p>Already have an account ?
                    <Link className="Link" to = "/login">Login</Link>
                </p>
            </div>
    )
}
