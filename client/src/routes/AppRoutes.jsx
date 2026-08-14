import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Courses from "../components/common/Courses";
import Register from "../pages/auth/Registration";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/courses" element={<Courses />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;