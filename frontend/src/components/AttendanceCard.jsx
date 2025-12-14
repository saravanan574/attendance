import { useContext, useState, useEffect } from "react";
import { AttendanceContext } from "./AttendanceContext";
import Button from "./Button";

const AttendanceCard = () => {
  const { attendance } = useContext(AttendanceContext);

  // Return nothing if attendance data is not loaded
  if (!attendance) return null;

  const total = attendance.presentCount + attendance.absentCount;
  const percentage = total === 0 ? 0 : Math.ceil((attendance.presentCount / total) * 100);

  // Initialize increment state safely
  const [increment, setIncrement] = useState({
    present: attendance.presentCount,
    absent: attendance.absentCount,
    percentage: percentage
  });

  useEffect(() => {
    const total = attendance.presentCount + attendance.absentCount;
    const perc = total === 0 ? 0 : Math.ceil((attendance.presentCount / total) * 100);

    setIncrement({
      present: attendance.presentCount,
      absent: attendance.absentCount,
      percentage: perc
    });
  }, [attendance]);

  const handleChange = (type, value) => {
    setIncrement((prev) => {
      let pre = prev.present;
      let abs = prev.absent;

      if (type === 0) pre = Math.max(attendance.presentCount, pre + value);
      else abs = Math.max(attendance.absentCount, abs + value);

      const tot = Math.ceil((pre / (pre + abs)) * 100);

      return { present: pre, absent: abs, percentage: tot };
    });
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-around" }}>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card calculate-box" style={{ marginTop: "15px" }}>
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
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <span>Present: {(increment?.present ?? 0) - attendance.presentCount}</span>
              <span>Absent: {(increment?.absent ?? 0) - attendance.absentCount}</span>
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
