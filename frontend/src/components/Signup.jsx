import "../App.css";
import {useNavigate} from "react-router-dom";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const signup = async ()=>{
    if (!name || !email || !username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }try{
      const res = await fetch("http://localhost:7000/api/auth/signup",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name, email, username, password})
    });
    const data = await res.json();
    if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
    }    
    alert("Signup Successful");
    navigate("/login")
  }catch(err){
    setError("server not reachable");
  }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>
          AUTOMATED<br />ATTENDANCE<br />SYSTEM
        </h2>
        {error && <p className="error">{error}</p>}
        <input type="text" placeholder="Full Name" onChange={e=>setName(e.target.value)}/>
        <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
        <input type="text" placeholder="Username" onChange={e=>setUsername(e.target.value)}/>
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
        <input type="password" placeholder="Confirm Password" onChange={e=>setConfirmPassword(e.target.value)}/>

        <button className="login-btn"onClick={signup}>SIGN UP</button>

        <p className="register-text">
          Already have an account? <span onClick={()=>navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
