import "../App.css"
import {useNavigate} from "react-router-dom";

function Main(){
   const navigate = useNavigate(); 

    return (
      <div className="m-bdy">
        <div>
          <h1>AUTOMATTED ATTENDANCE SYSTEM FOR RURAL SCHOOLS</h1>
          <button onClick={()=>navigate("/login")}>Get Started</button>
        </div>
      </div>
    );
}

export default Main;