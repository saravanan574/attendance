import AttendanceCard from "../components/AttendanceCard";
import AttendanceHistory from "../components/AttendanceHistory";
import {AttendanceContext} from "../components/AttendanceContext";
import { useContext,useEffect } from "react";
import Button from "../components/Button";
import {useNavigate} from "react-router-dom"

const Attendance = () =>{
    const { attendance, setAttendance } = useContext(AttendanceContext);
    if(!attendance) return <p>Loading...</p>
    const navigate = useNavigate();
    const API = "http://localhost:5000"
    const logout = async() => {
        const log = await fetch(`${API}/logout`,{
            method :"GET",
            headers:{"Authorizations":"Bearer "+localStorage.getItem("token")}
        })
        if(localStorage.getItem("token")){
            localStorage.clearItem("token");
            navigate("/login",{replace:true});
            return;
        }
    }
    return (
        <div className = "attendance">
            <div style = {{display:"flex",backgroundColor:"gray",color:"white",justifyContent:"space-around", alignItems:"center"}}>
                <h3>{attendance.data.name}</h3>
                <h3>Attendance </h3>
                <Button variant="att-btn" onClick = {logout}>Logout</Button>
            </div>
            <div className = "attendance-page">
                <div className="left-box">
                    <AttendanceCard  />
                </div>
                <div className ="right-box">
                    <AttendanceHistory />
                </div>
            </div>
        </div>
        
    )
};

export default Attendance;
