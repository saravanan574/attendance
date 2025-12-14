import { useState, useContext, useEffect } from "react";
import { AttendanceContext } from "./AttendanceContext";
import Button from "./Button";

const AttendanceHistory = () => {
  const { attendance, setAttendance } = useContext(AttendanceContext);
  const API = import.meta.env.VITE_API_BASE_URL;

  const [history, setHistory] = useState([]);
  const [today, setToday] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modify, setModify] = useState(false);

  useEffect(() => {
    if (!attendance) return;

    const todayDate = new Date().toISOString().split("T")[0];
    setToday(attendance.days.filter(d => d.date === todayDate));
    setHistory(attendance.days);
  }, [attendance]);

  const handleChange = (date, status, saveNow) => {
    setHistory(prev =>
      prev.map(d => (d.date === date ? { ...d, status } : d))
    );

    if (saveNow) {
      setModify(true);
      updateHistory();
    }
  };

  const filterBy = type => {
    setFilter(type);
    if (type === "All") {
      setHistory(attendance.days);
    } else {
      setHistory(attendance.days.filter(d => d.status === type));
    }
  };

  const updateHistory = async () => {
    if (!modify) {
      setModify(true);
      return;
    }

    const res = await fetch(`${API}/api/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(history)
    });

    const data = await res.json();

    if (data.status === "success") {
      setAttendance(prev => ({
        ...prev,
        days: history,
        presentCount: history.filter(h => h.status === "Present").length,
        absentCount: history.filter(h => h.status === "Absent").length
      }));

      setModify(false);
      filterBy("All");
    }
  };

  if (!attendance) return null;

return (
        <div className="card">
            <div className=" history-list">
                    <h4>Today Attendance </h4>
                    {today.length == 0 && <div className = "history-item" ><h2>Today is Sunday</h2></div>}
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
                    {!modify && <select value = {filter} onChange= {(e)=> filterBy(e.target.value)}
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
