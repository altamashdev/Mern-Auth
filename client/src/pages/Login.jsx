//There are we create both register or login with help of state dynamic
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate(); //for redirecting

  const { backendUrl, isLoggedIn, setIsLoggedIn, getUserData, userData } =
    useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false); //for password hide show in input field

  // With help of this we can automatic reset the value of input fiels when the state change so its look professional
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, [state]);

  useEffect(() => {
    if (isLoggedIn === true) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      // Make it always true for sending cookies in backend

      //if state is sign-up hit api for signup
      if (state === "Sign Up") {
        //hit api on backend and also send data
        const { data } = await axios.post(
          backendUrl + "/api/auth/register",
          {
            name,
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        // if data send successfully than set logged in
        if (data.success) {
          setIsLoggedIn(true); //User show Logged in
          await getUserData();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        //hit api on backend and also send data
        const { data } = await axios.post(
          backendUrl + "/api/auth/login",
          {
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json"
            },
          }
        );

        // if data send successfully than set logged in
        if (data.success) {
          setIsLoggedIn(true); //User show Logged in
          await getUserData();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:p-0 bg-gradient-to-br from-blue-200 to-purple-400">
      {/* Logo Image */}
      <img
        onClick={() => navigate("/")}
        src={'/logo.png'}
        alt=""
        className="absolute left-40 top-15 sm:top-5 sm:left-20 top-5 w-25 sm:w-25 cursor-pointer rounded-full"
        loading="lazy"
      />

      {/* Main Form Div */}
      <div className="bg-slate-900 w-full sm:w-96 flex flex-col justify-between items-center min-h-50 p-8 sm:p-15 text-indigo-300 text-sm rounded-lg shadow-lg">
        <h2 className="text-3xl mb-2.5 font-semibold text-white">
          {state === "Sign Up" ? "Create Account " : "Login"}
        </h2>
        <p className="text-sm mb-6 font-medium">
          {" "}
          {state === "Sign Up" ? "Create Your Account " : "Login Your Account"}
        </p>

        {/*Form Start Here It's dynamic form without any extra pages both are in one page*/}
        <form onSubmit={onSubmitHandler}>
          {/* Full Name div By State */}
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <User className="text-gray-400 w-5" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                className="bg-transparent outline-none text-gray-200"
                required
              />
            </div>
          )}

          {/* Div for Email */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <Mail className="text-gray-400 w-5" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none text-gray-200"
              required
            />
          </div>

          {/* Div for Password */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <Lock className="text-gray-400 w-5" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={!show ? "password" : "text"}
              placeholder="Password"
              className="bg-transparent outline-none text-gray-200"
              required
            />
            {/* div for password show and hide */}
            <div
              onClick={() => {
                show == false ? setShow(true) : setShow(false);
              }}
            >
              {show === false ? (
                <Eye className="text-gray-400 w-5" />
              ) : (
                <EyeOff className="text-gray-400 w-5" />
              )}
            </div>
          </div>

          {/* Forgot Password */}
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password ?
          </p>

          {/* Button for SignUp/Login */}
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
            {state}
          </button>
        </form>

        {/* Login or Sign Up page exchange */}
        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account ?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline hover:text-white active:text-white"
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account ?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline hover:text-white active:text-white"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
