import "../APP.CSS"
import {useNavigate} from "react-router-dom";
import { useState } from "react";

function Login(){
  const navigate = useNavigate();
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async ()=>{
    if (!username || !password) {
      setError("All fields are required");
      return;
    }
    try{
    const res =await fetch("http://localhost:7000/api/auth/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username,password})
    });

    const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }
      localStorage.setItem("token",data.token);
      navigate("/dashboard");
    
  }catch(err){
      setError("server not reached");
    }
  }

    return(
 <div className="login-container">
      <div className="login-box">
        <h2>
          AUTOMATTED<br/>ATTENDANCE<br/>SYSTEM
        </h2>
        {error && <p className="error">{error}</p>}
        <input type="text" placeholder="Username" onChange={e=>setUsername(e.target.value)}/>
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
        <button className="login-btn" onClick={login}>LOG IN</button>
        <p className="register-text">
          Don't have an account? <span onClick={()=>navigate("/signup")}>Register Now</span>
        </p>
      </div>
    </div>
    );
}

export default Login;