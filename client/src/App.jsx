import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVarify from "./pages/EmailVarify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div>
      <ToastContainer
       position="top-center"
       autoClose={2000} 
       style={{ top: "20px" }}
       className="!w-full !max-w-[90%] !mx-5"
       toastClassName="!rounded-xl !p-5 !text-sm !min-h-0"
       theme="light"
       />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-varify" element={<EmailVarify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
