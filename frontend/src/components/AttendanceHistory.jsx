import { useState, useContext, useEffect, useRef } from "react";
import { AttendanceContext } from "./AttendanceContext";
import Button from "./Button";
import Loader from "../pages/Loader";

const AttendanceHistory = () => {
  const { attendance, setAttendance } = useContext(AttendanceContext);
  const API = import.meta.env.VITE_API_BASE_URL;

  const [history, setHistory] = useState([]);
  const [count, setCount] = useState(null);
  const [today, setToday] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modify, setModify] = useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (!attendance || initialized.current) return;

    const todayDate = new Date().toISOString().split("T")[0];
    setHistory(attendance.days);
    setToday(attendance.days.filter(d => d.date === todayDate));

    initialized.current = true;
  }, [attendance]);

  // Generic API call
  const api = async (updatedHistory) => {
    try {
      const res = await fetch(`${API}/api/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(updatedHistory)
      });

      if (!res.ok) return;

      const datas = await res.json();
      if (datas.status === "success") {
        setAttendance(prev => ({
          ...prev,
          days: datas.data.days,
          presentCount: datas.data.days.filter(h => h.status === "Present").length,
          absentCount: datas.data.days.filter(h => h.status === "Absent").length,
          holidayCount: datas.data.days.filter(h => h.status === "Holiday").length
        }));

        const todayDate = new Date().toISOString().split("T")[0];
        setToday(datas.data.days.filter(d => d.date === todayDate));
        setModify(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Separate function for updating today's attendance
  const updateTodayStatus = async (status) => {
    if (!today[0]) return;

    // Update history
    const updatedHistory = history.map(d =>
      d.date === today[0].date ? { ...d, status } : d
    );
    setHistory(updatedHistory);

    // Update today div immediately
    setToday([{ ...today[0], status }]);

    // Call API with updated array
    await api(updatedHistory);
  };

  // General handleChange for history items
  const handleChange = (date, status) => {
    const updatedHistory = history.map(d =>
      d.date === date ? { ...d, status } : d
    );
    setHistory(updatedHistory);
  };

  const filterBy = type => {
    setFilter(type);
    if (type === "All") {
      setCount(null);
      setHistory(attendance.days);
    } else {
      const filtered = attendance.days.filter(d => d.status === type);
      setHistory(filtered);
      setCount(filtered.length + " found");
    }
  };

  if (!attendance) return <Loader />;

  return (
    <div className="card">
      <div className="history-list">
        <h4>Today Attendance</h4>

        {today.length === 0 && (
          <div className="history-item">
            <h2>Today is Sunday</h2>
          </div>
        )}

        {today.map(item => (
          <div
            key={item.date}
            className={`history-item ${item.status}`}
            style={{ border: "1px solid red", boxShadow: "0 5px 20px rgba(0,1,2,0.03)" }}
          >
            <div>
              <strong>{item.date}</strong> -{" "}
              <strong className="muted">{item.day}</strong>
            </div>

            <span className={`status ${item.status}`}>
              {item.status || "Not Marked"}
            </span>

            {!item.status && (
              <div className="editbtn" style={{ gap: "5px" }}>
                <Button
                  onClick={() => updateTodayStatus("Present")}
                  className="Present"
                  variant="att-btn"
                >
                  Present
                </Button>
                <Button
                  onClick={() => updateTodayStatus("Absent")}
                  className="Absent"
                  variant="att-btn"
                >
                  Absent
                </Button>
                <Button
                  onClick={() => updateTodayStatus("Holiday")}
                  className="Holiday"
                  variant="att-btn"
                >
                  Holiday
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* History section */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>History</h3>

          <div>
            <span style={{ color: "red", backgroundColor: "#f6f32f", borderRadius: "2px" }}>
              {count}
            </span>

            {modify ? (
              <Button variant="att-btn" onClick={() => setModify(false)} bg="red" col="white">
                Cancel
              </Button>
            ) : (
              <select
                value={filter}
                onChange={e => filterBy(e.target.value)}
                style={{
                  padding: "3px",
                  margin: "4px",
                  width: "60px",
                  borderRadius: "10px",
                  height: "39px"
                }}
              >
                <option value="All">All</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Holiday">Holiday</option>
              </select>
            )}

            <Button
              variant="att-btn"
              onClick={() => (modify ? api(history) : setModify(true))}
              col="white"
              bg={modify ? "green" : "blue"}
            >
              {modify ? "Save" : "Edit"}
            </Button>
          </div>
        </div>

        <div className="history-list">
          {history.map(item => (
            <div key={item.date} className={`history-item ${item.status}`}>
              <div>
                <strong>{item.date}</strong> -{" "}
                <strong className="muted">{item.day}</strong>
              </div>

              <span className={`status ${item.status}`}>
                {item.status || "Not Marked"}
              </span>

              {modify && (
                <div className="editbtn" style={{ gap: "3px" }}>
                  <Button
                    onClick={() => handleChange(item.date, "Present")}
                    variant="att-btn"
                    className="Present"
                  >
                    Present
                  </Button>
                  <Button
                    onClick={() => handleChange(item.date, "Absent")}
                    className="Absent"
                    variant="att-btn"
                  >
                    Absent
                  </Button>
                  <Button
                    onClick={() => handleChange(item.date, "Holiday")}
                    className="Holiday"
                    variant="att-btn"
                  >
                    Holiday
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
