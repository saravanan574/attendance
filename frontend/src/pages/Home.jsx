
import { useNavigate } from "react-router-dom";
import Button from "../components/Button"
const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

  return (
      <div className="card" style = {{display:"flex",flexDirection:"column",margin:"10px 10px"}}>
        
        <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Student Attendance Management System</h1>
        <p className="subtitle">
          Track, analyze, and plan your attendance efficiently
        </p>
      </header>
    <section>
    <div className="card" style = {{margin:"5px",backgroundColor:"#14161a"}}>
            
            {!isLoggedIn ? (
              <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                <Button className="home-btn"  onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button className="home-btn"  onClick={() => navigate("/register")}>
                  Register
                </Button>
              </div>
            ):(
              <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                <Button  onClick={() => navigate("/attendance")}>
                Dashboard
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  }}
                >
                  Logout
                </Button>
              </div>
            )}
        </div>
    </section>
      {/* Main Content */}
      <section className="dashboard-content">
        <div className="dashboard-card">
          <h2>Overview</h2>
          <p>
            This system allows students to monitor their attendance on a
            day-to-day basis. Attendance records are updated instantly and
            reflected in real-time percentage calculations.
          </p>
        </div>

        <div className="dashboard-card">
          <h2>Core Features</h2>
          <ul>
            <li>Mark attendance daily as <strong>Present</strong>, <strong>Absent</strong>, or <strong>Holiday</strong></li>
            <li>Edit mistakenly updated attendance using history edit mode</li>
            <li>Filter attendance by Present, Absent, and Holiday</li>
            <li>Instant and automatic attendance percentage calculation</li>
            <li>Attendance calculator to plan for <strong>75% eligibility</strong></li>
          </ul>
        </div>

        <div className="dashboard-card">
          <h2>Attendance Percentage</h2>
          <p>
            The displayed attendance percentage is <strong>indicative</strong> and
            meant for planning purposes only. Final eligibility depends on
            institutional policies.
          </p>
        </div>

        <div className="dashboard-card warning">
          <h2>Important Note</h2>
          <p>
            This system is intended for personal tracking and planning. It does
            not replace official attendance records maintained by the institution.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 Student Attendance Management System</p>
      </footer>
    </div>

      </div>
  );
};

export default Home;
