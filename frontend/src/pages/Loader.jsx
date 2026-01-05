import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Loader = () => {
  const navigate = useNavigate();
  useEffect(() => { 
      const token = localStorage.getItem("token");      
      if (!token) {
        navigate("/login");
        return;
      }
  });
    return (
      <div className="loader-overlay">
       
        <div className="loader-card">
          <div className="spinner"><>$</></div>
        </div>
      </div>
    );
  };
  
  export default Loader;
  