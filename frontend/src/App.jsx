import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Attendance from "./pages/Attendance";
import { AttendanceProvider } from "./components/AttendanceContext";
import "./App.css";
import Loader from "./pages/Loader";

export default function App() {
  
  return (
    <HashRouter>
      <AttendanceProvider>
        <Routes>
          <Route path="/" element={<Attendance />} />
          <Route path="/home" element = {<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </AttendanceProvider>
    </HashRouter>
  );
}
