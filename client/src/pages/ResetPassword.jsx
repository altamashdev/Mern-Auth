import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { data, useNavigate } from "react-router-dom";
import { Mail, Lock, LockIcon } from "lucide-react";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

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

  // Function For Email Submiting
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      if (
        data.success === false &&
        data.message === "Otp Send Already Check Email!"
      ) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        data.success ? toast.success(data.message) : toast.error(data.message);
        data.success && setIsEmailSent(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // OnSubmit OTP FOR Reset Password
  const onSubmitOtp = async (e) => {
    e.preventDefault();

    // we got inputs value in this variable by user
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:p-0 bg-gradient-to-br from-blue-200 to-purple-400">
      {/* Logo Image */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-40 top-15 sm:top-5 sm:left-20 top-5 w-25 sm:w-25 cursor-pointer rounded-full"
      />

      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-600">
            Enter your Register Email Address{" "}
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <Mail className="text-gray-400 w-5" />
            <input
              type="email"
              className="bg-transparent outline-none text-gray-200"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
            Submit
          </button>
        </form>
      )}

      {!isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
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
                  className="w-10 h-10 bg-[#333A5C] text-white text-center text-xl rounded-md "
                  key={index}
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white">
            Submit OTP
          </button>
        </form>
      )}

      {isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-600">
            Enter your New Password{" "}
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <Lock className="text-gray-400 w-5" />
            <input
              type="password"
              className="bg-transparent outline-none text-gray-200"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
