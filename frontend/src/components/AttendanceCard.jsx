import { useContext, useState, useEffect } from "react";
import { AttendanceContext } from "./AttendanceContext";
import Button from "./Button";

const AttendanceCard = () => {
  const { attendance } = useContext(AttendanceContext);

  // ✅ Hooks MUST come before any return
  const [increment, setIncrement] = useState({
    present: 0,
    absent: 0,
    percentage: 0
  });

  useEffect(() => {
    if (!attendance) return;

    const total = attendance.presentCount + attendance.absentCount;
    const perc = total === 0 ? 0 : ((attendance.presentCount / total) * 100).toFixed(2);

    setIncrement({
      present: attendance.presentCount,
      absent: attendance.absentCount,
      percentage: perc
    });
  }, [attendance?.presentCount, attendance?.absentCount]);
  // 👆 precise dependencies — prevents infinite loop

  // ✅ SAFE early return AFTER hooks
  if (!attendance) return null;

  const total = attendance.presentCount + attendance.absentCount;
  const percentage =
    total === 0 ? 0 : ((attendance.presentCount / total) * 100).toFixed(2);

  const handleChange = (type, value) => {
    setIncrement(prev => {
      let pre = prev.present;
      let abs = prev.absent;

      if (type === 0) pre = Math.max(attendance.presentCount, pre + value);
      else abs = Math.max(attendance.absentCount, abs + value);

      const tot = ((pre / (pre + abs)) * 100).toFixed(2);

      return { present: pre, absent: abs, percentage: tot };
    });
  };

  return (
    <div>
      <div className="card"  >
        <div style={{ display: "flex", justifyContent: "space-around", alignItems:"center",padding:"5px 3px"}}>
          <div className="circle-container">
            <div
              className="progress-circle"
              style={{
                background: `conic-gradient(${
                  percentage >= 75
                    ? "#4caf50"
                    : percentage >= 60
                    ? "orange"
                    : "red"
                } ${percentage * 3.6}deg,#ddd 0deg)`
              }}
            >
              <div className="circle-inner">
                <h4>{percentage}%</h4>
              </div>
            </div>
          </div>
          <div>
            <table cellPadding={6}>
              <tbody>
                <tr>
                  <th>Total</th>
                  <td>{total}</td>
                </tr>
                <tr>
                  <th>Present</th>
                  <td>{attendance.presentCount}</td>
                </tr>
                <tr>
                  <th>Absent</th>
                  <td>{attendance.absentCount}</td>
                </tr>
                <tr>
                  <th>Percentage</th>
                  <td>{((attendance.presentCount / total) * 100).toFixed(2)}</td>
                </tr>
                {((attendance.presentCount / total) * 100).toFixed(2) < 75 && (<tr>
                  <th style ={{color:"white",backgroundColor:"red"}}>Required class</th>
                  <td>{3*attendance.absentCount-attendance.presentCount}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card" >
        <h3>Attendance Calculator</h3>
        <div className="calc-button">
          <div className="btn-group">
            <Button
              variant="att-btn"
              className="success"
              onClick={() => handleChange(0, 1)}
            >
              +
            </Button>
            <Button
              variant="att-btn"
              className="success"
              onClick={() => handleChange(0, -1)}
            >
              -
            </Button>
          </div>

          <div>
            <div
              className="progress-wrapper"
              style={{
                "--percentage": increment?.percentage ?? 0,
                "--color": increment?.percentage >= 75 ? "#4caf50" : "red"
              }}
            >
              <div className="progress-bar"></div>
            </div>
            <h4 style={{ textAlign: "center" }}>{increment?.percentage ?? 0}%</h4>
            <div style={{ display: "flex",width:"100%",gap:"2px",justifyContent:"space-around",  alignItems: "center" }}>
                <span>Present {(increment?.present ?? 0) - attendance.presentCount}</span>
                <span>
                  <Button variant = "att-btn" bg = "#fefefe"  col = "#00000" onClick={() =>setIncrement({
      present: attendance.presentCount,
      absent: attendance.absentCount,
      percentage: ((attendance.presentCount / total) * 100).toFixed(2)
    })}>Clear</Button>
                </span>
                <span>Absent {(increment?.absent ?? 0) - attendance.absentCount}</span>
              </div>
          </div>

          <div className="btn-group">
            <Button
              variant="att-btn"
              className="failed"
              onClick={() => handleChange(1, 1)}
            >
              +
            </Button>
            <Button
              variant="att-btn"
              className="failed"
              onClick={() => handleChange(1, -1)}
            >
              -
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
