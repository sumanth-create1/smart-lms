import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";

function Home() {
  return <h1>Home</h1>;
}



function Register() {
  return <h1>Register</h1>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}