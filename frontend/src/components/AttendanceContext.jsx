import { createContext, useEffect, useState } from "react";

export const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const load = async () => {
      const token = localStorage.getItem("token");

      // Do NOT navigate here
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/api/attendance`, {
          headers: { Authorization: "Bearer " + token }
        });

        if (!res.ok) {
          setAttendance(null);
          setLoading(false);
          return;
        }

        const json = await res.json();
        const dat = json.data;

        setAttendance({
          data: dat,
          days: dat.days || [],
          presentCount: dat.days.filter(d => d.status === "Present").length,
          absentCount: dat.days.filter(d => d.status === "Absent").length
        });
      } catch (err) {
        console.error("Attendance load failed", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AttendanceContext.Provider
      value={{ attendance, setAttendance, loading }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
