import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await fetch(`${API}/api/attendance`, {
        headers: { Authorization: "Bearer " + token }
      });

      if (!res.ok) return navigate("/login");
      const data = await res.json();
      setAttendance(data.data);
    };
    load();
  }, []);

  return (
    <AttendanceContext.Provider value={{ attendance, setAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
};
