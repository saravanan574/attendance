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

    const res = await fetch(`${API}/api/attendance`, {
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
      <h4>Today Attendance</h4>

      {today.length === 0 && <h3>Today is Sunday</h3>}

      {today.map(item => (
        <div key={item.date} className="history-item">
          <strong>{item.date}</strong>
          <div className="muted">{item.day}</div>
          <span className={`status ${item.status?.toLowerCase()}`}>
            {item.status || "Not Marked"}
          </span>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>History</h3>

        <div>
          {!modify && (
            <select value={filter} onChange={e => filterBy(e.target.value)}>
              <option>All</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Holiday</option>
            </select>
          )}

          {modify && (
            <Button variant="att-btn" onClick={() => setModify(false)}>
              Cancel
            </Button>
          )}

          <Button variant="att-btn" onClick={updateHistory}>
            {modify ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      <div className="history-list">
        {history.map(item => (
          <div key={item.date} className={`history-item ${item.status}`}>
            <strong>{item.date}</strong>
            <div className="muted">{item.day}</div>
            <span className={`status ${item.status}`}>
              {item.status || "Not Marked"}
            </span>

            {modify && (
              <div className="editbtn">
                <Button onClick={() => handleChange(item.date, "Present", false)}>Present</Button>
                <Button onClick={() => handleChange(item.date, "Absent", false)}>Absent</Button>
                <Button onClick={() => handleChange(item.date, "Holiday", false)}>Holiday</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceHistory;
