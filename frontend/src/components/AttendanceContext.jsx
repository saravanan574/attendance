  import { createContext, useEffect, useState } from "react";
  import {useNavigate} from "react-router-dom";

  export const AttendanceContext = createContext(null);

  export const AttendanceProvider = ({ children }) => {
    const API = import.meta.env.VITE_API_BASE_URL;
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => { 
      const load = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        try {
          const res = await fetch(`${API}/api/attendance`, {
            headers: { Authorization: "Bearer " + token }
          });
          const json = await res.json();
          if (json.status == "failed" && json.message == "Token is expired " ) {
            localStorage.removeItem("token");
            navigate("/Login");
            return;
          }
          else if(json.status == "failed"){
            navigate("/loader");
            return;
          }
          const dat = json.data;

          setAttendance({
            data: dat,
            days: dat.days || [],
            presentCount: dat.days.filter(d => d.status === "Present").length,
            absentCount: dat.days.filter(d => d.status === "Absent").length,
            holidayCount: dat.days.filter(h => h.status === "Holiday").length
          });
        } catch (err) {
          console.error("Attendance load failed", err);
        } finally {
          setLoading(false);
        }
      };

      load();
    }, [attendance]);

    return (
      <AttendanceContext.Provider
        value={{ attendance, setAttendance, loading }}
      >
        {children}
      </AttendanceContext.Provider>
    );
  };
