
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Attendance from "./pages/Attendance";
import Login from "./pages/Login";
import Register from "./pages/Register"
import {AttendanceProvider} from "./components/AttendanceContext";
import "./App.css"

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/register" element = {<Register />} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/attendance" element = {
          <AttendanceProvider >
            <Attendance />
          </AttendanceProvider>
          } />
      </Routes>
    </BrowserRouter>
  
  )
}
