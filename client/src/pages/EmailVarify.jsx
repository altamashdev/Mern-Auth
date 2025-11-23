// There Are Most Usefull Steps Must Remember
// 1. Making input fields as a new coder like this professional
// 2. Makign auto move to next input on enter otp
// 3. Remove By BackSpace
// 4. Copy-Paste Functionality

import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVarify = () => {
  // Getting from AppContext.jsx from backend direct
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContent);

  const navigate = useNavigate();
  // store otp for input fiels
  const inputRefs = React.useRef([]);

  // for automatic moving input to next input box means otp letter
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // For Remove By BackSpace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // For Copy-Paste each input and yes use This function in div not in input field
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    axios.defaults.withCredentials = true;

    try {
      e.preventDefault();

      // we got inputs value in this variable by user
      const otpArray = inputRefs.current.map((e) => e.value);

      // Remember this these code are from different inputs so now we make it all togher means a String
      const otp = otpArray.join("");

      // Now we send this otp on backend to check with database
      const { data } = await axios.post(
        backendUrl + "/api/auth/varify-account",
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
        // isLoggedIn(true);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(()=>{
      isLoggedIn && userData && userData.isAccountVarified && navigate('/');
  },[isLoggedIn,userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:p-0 bg-gradient-to-br from-blue-200 to-purple-400">
      {/* Logo Image */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-40 top-15 sm:top-5 sm:left-20 top-5 w-25 sm:w-25 cursor-pointer rounded-full"
      />

      <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm" onSubmit={onSubmitHandler}>
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-600">
          Enter the 6 Digit code send to your Email{" "}
        </p>
        {/* Mulitple Input Fiels for multiple input */}
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-10 h-10 bg-[#333A5C] text-white text-center text-xl rounded-md "
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVarify;
