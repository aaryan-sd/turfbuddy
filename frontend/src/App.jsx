import { Routes, Route } from "react-router-dom";
import Signup from "./Pages/User/Signup.jsx";
import OTPVerify from "./Pages/User/OTPVerify.jsx";
import Login from "./Pages/User/Login.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/verify" element={<OTPVerify />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
