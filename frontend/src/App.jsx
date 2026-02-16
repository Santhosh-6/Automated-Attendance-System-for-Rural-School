import { Routes, Route } from "react-router-dom";
import AddStudents from "./components/AddStudents";
import Login from "./components/Login.jsx"
import Signup from "./components/Signup.jsx"
import Dashboard from "./components/Dashboard.jsx"
import Reports from "./components/Reports.jsx"
import TakeAttendance from "./components/TakeAttendance.jsx"
import Main from "./components/Main.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="/add-students" element={<AddStudents />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/reports" element={<Reports/>}/>
      <Route path="/take-attendance" element={<TakeAttendance/>}/>
    </Routes>
  );
}

export default App;
