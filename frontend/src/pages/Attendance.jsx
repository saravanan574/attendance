import AttendanceCard from "../components/AttendanceCard";
import AttendanceHistory from "../components/AttendanceHistory";
import { AttendanceContext } from "../components/AttendanceContext";
import { useContext } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import {Link } from "react-router-dom"
import Loader from "./Loader"

const Attendance = () => {
  const navigate = useNavigate(); // ✅ hooks at top
  const { attendance } = useContext(AttendanceContext);

  const API = import.meta.env.VITE_API_BASE_URL;

  // if (!attendance) return <Loader />;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (

    <div className="attendance">
      <div className="card dashboard-header"
        style={{
          display: "flex",
          height:"60px",
          width:"100%",
          
          background:"linear-gradient(135deg, #010101, #2a5298)",
          color: "white",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h3>{attendance?.data?.name}</h3>
        <div>
        <Button variant="att-btn" bg="white">
        <Link to="/">Home</Link>
        </Button>
        <Button variant="att-btn" bg="red" col = "white" onClick={logout}>
          Logout
        </Button>
        </div>
      </div>
      {!attendance ? (
          <div className="attendance-page">
            <div className="left-box">
              <AttendanceCard />
            </div>
            <div className="right-box">
              <AttendanceHistory />
            </div>
          </div>): (
          <div className="attendance-page">
            <div className="left-box">
              <AttendanceCard />
            </div>
            <div className="right-box">
              <AttendanceHistory />
            </div>
          </div>
        
      )}
      </div>
  );
};

export default Attendance;
