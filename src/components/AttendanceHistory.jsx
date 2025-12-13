import Button from "./Button";
import { useState, useContext, useEffect } from "react"
import {AttendanceContext} from "./AttendanceContext";


const AttendanceHistory = () => {
    const { attendance, setAttendance } = useContext(AttendanceContext);
    const [today,setToday] = useState([]);
    const API = "https://attendance-um8v.onrender.com";
    const [history,setHistory] = useState(attendance.days);
    const [filter,setFilter] = useState("All");
    const [modify,setModify ] = useState(false);
    useEffect(() => {
        const k = attendance.days.filter(d => d.date == new Date().toISOString().split("T")[0])
        setToday(k);
        const j = attendance.days.filter(d => {
            if(filter == "All") return true;
            return d.status == filter;
        })
        setHistory(attendance.days);
    },[attendance])
    
    const handleChange = (date,status,ty) =>{
        setHistory(prev =>prev.map(p => p.date == date ? {...p,status}:p));
        if(ty) {
            setModify(!modify);
            updateHistory();
        }
    }

    const filterby = (type) => {
        setFilter(type);
        if(type == "All") {
            console.log("fdsaf");
            setHistory(prev =>attendance.days);
            return;
        }
        setHistory(prev =>{
            const k = attendance.days.filter(d => d.status === type);
            return k;
        })
    }
    const updateHistory = async() => {
        if(!modify){
            setModify(!modify);
            return;
        }
        const up = await fetch(`${API}/update`,{
            method:"PUT",
            headers:{"Content-Type":"application/json","Authorizations":"Bearer "+localStorage.getItem("token")},
            body:JSON.stringify(history)
        })
        const sav = await up.json();
        if(sav.status == "success"){
            setAttendance(prev => ({
                ...prev,
                days:history,
                presentCount:history.filter(h => h.status == "Present").length,
                absentCount:history.filter(h => h.status == "Absent").length,
            }));
            setModify(!modify);
            filterby("All");
        }
        else{
            console.log("Something is failed",sav.message);
        }
        
    }
    return (
        <div className="card">
            <div className=" history-list">
                    <h4>Today Attendance </h4>
                    {!today && <div className = "history-item" ><h2>Today is Sunday</h2></div>}
                    {today && (
                        today.map((item) => 
                        (<div id={item.date} className="history-item" style = {{border:"1px solid red",boxShadow:"0 5px 20px rgba(0,1,2,0.03)"}}>
                            <strong>{item.date}</strong>
                            <div className="muted">{item.day}</div> 
                            <span className={`status ${item.status && item.status?.toLowerCase()}`}>{item.status ||"Not Marked"}</span>
                            {!item.status && <div className = "editbtn" style ={{gap:"3px"}}>
                                <Button onClick={() => handleChange(item.date,"Present",true)} className = "Present"  variant="att-btn">Present</Button>
                                <Button onClick={() => handleChange(item.date,"Absent",true)} className = "Absent" variant="att-btn">Absent</Button>
                                <Button onClick={() => handleChange(item.date,"Holiday",true)} className = "Holiday" variant="att-btn">Holiday</Button>
                            </div>}
                        </div>)
                    ))}
            </div>
            <div>
                <div style = {{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <h3>History</h3>   
                    <div>
                    {!modify && <select value = {filter} onChange= {(e)=> filterby(e.target.value)}
                    style={{padding:"3px",margin:"4px",Width:"60px",borderRadius:"10px",height:"39px"}}>
                        <option value = "All">All</option>
                        <option value = "Present">Present</option>
                        <option value = "Absent">Absent</option>
                        <option value = "Holiday">Holiday</option>
                    </select>}
                    {modify && 
                    <Button variant = "att-btn" onClick={() =>setModify(!modify)} > Cancel</Button>
}
                    <Button variant = "att-btn" onClick={updateHistory} > {modify?"Save":"Edit"}</Button>
              
                    </div>
                  </div>
                <div className="history-list">
                        {history.map((item) => 
                            (<div id={item.date} className={`history-item ${item.status}`}>
                                <strong>{item.date}</strong>
                                <div className="muted">{item.day}</div> 
                                <span className={`status ${item.status}`}>{item.status ||"Not Marked"}</span>
                                {modify && <div className = "editbtn" style ={{gap:"3px"}}>
                                <Button onClick={() => handleChange(item.date,"Present",false)}  variant="att-btn" className = "Present" >Present</Button>
                                <Button onClick={() => handleChange(item.date,"Absent",false)} className = "Absent" variant="att-btn">Absent</Button>
                                <Button onClick={() => handleChange(item.date,"Holiday",false)} className = "Holiday" variant="att-btn">Holiday</Button>
                            </div>}
                            </div>
                            )
                        )}
                </div>
            </div>
        </div>
    )
}

export default AttendanceHistory;
