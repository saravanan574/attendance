import AttendanceCard from "../components/AttendanceCard";
import AttendanceHistory from "../components/AttendanceHistory";
import { AttendanceContext } from "../components/AttendanceContext";
import { useContext } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const navigate = useNavigate(); // ✅ hooks at top
  const { attendance } = useContext(AttendanceContext);

  const API = import.meta.env.VITE_API_BASE_URL;

  if (!attendance) return <p>Loading...</p>;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="attendance">
      <div
        style={{
          display: "flex",
          backgroundColor: "gray",
          color: "white",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        <h3>{attendance?.data?.name}</h3>
        <h3>Attendance</h3>
        <Button variant="att-btn" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="attendance-page">
        <div className="left-box">
          <AttendanceCard />
        </div>
        <div className="right-box">
          <AttendanceHistory />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
