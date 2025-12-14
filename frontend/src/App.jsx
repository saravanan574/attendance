import { HashrRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Attendance from "./pages/Attendance";
import { AttendanceProvider } from "./components/AttendanceContext";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/attendance"
          element={
            <AttendanceProvider>
              <Attendance />
            </AttendanceProvider>
          }
        />
      </Routes>
    </HashRouter>
  );
}
