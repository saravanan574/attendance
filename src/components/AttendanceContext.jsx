import { createContext, useContext } from "react";
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const AttendanceContext = createContext();

export const AttendanceProvider = ({children}) => {
    const API  = "http://localhost:5000"
    const navigate = useNavigate();
    const [attendance,setAttendance] = useState();
    useEffect(() => {
        const get = async() => {
            if(localStorage.getItem("token") === null){
                navigate("/login");
                return;
            }
            const res = await fetch(`${API}/attendance`,{method:"GET",
                headers:{"Authorizations":"Bearer "+localStorage.getItem("token")}});
            const data =await res.json();
            if(res.ok){
                const dat = data.data;
                setAttendance(prev => ({
                    ...prev,
                    data:dat,
                    presentCount:dat.days.filter(item => item.status == "Present").length,
                    absentCount:dat.days.filter(item => item.status == "Absent").length,
                    days:dat.days
                }));
            }
            else{
                navigate("/login");
                return;
            }
        }
        get();
    },[])
    // const update = (date,newStatus) => {
    // setAttendance(prev => {
    //     const updateHistory = prev.days.map(item => 
    //         item.date == date ? {...item,status:newStatus}:item
    //     )
    //     return {
    //         ...prev,
    //         presentDays:updateHistory.filter(item => item.status == "present").length,
    //         absentDays:updateHistory.filter(item => item.status == "absend").length,
    //         days:updateHistory
    //     }
    // })
    return (
        <AttendanceContext.Provider value = {{attendance,setAttendance}}>
           {children}
        </AttendanceContext.Provider>
    )
}

