import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
const NavBar = () => {
  //creating navigate for redirection
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContent);


    const sendVarificationOtp = async ()=>{

      axios.defaults.withCredentials=true

      try {
        const {data} = await axios.post(backendUrl + '/api/auth/send-varify-otp');

          if(data.success){
            navigate('/email-varify');
            // console.log("gone");
            toast.success(data.message);
          }else{
            if(data.message === "OTP Already Sent"){
              navigate('/email-varify');
              toast.success(data.message);
            }else{
              toast.error(data.message);
            }
            
            // console.log("not");
          }


      } catch (error) {
        toast.error(error.message);
      }
    }

    // Logout Function
    const logout = async ()=>{

      // for cookies always sure it true
      axios.defaults.withCredentials=true

      try {
        const {data} = await axios.post(backendUrl + '/api/auth/logout');
        data.success && setIsLoggedIn(false);
        data.success && setUserData(false);
        navigate('/');
        
      } catch (error) {
        toast.error(error.message)
      }
    }

    const [open , setOpen] = useState("hidden");
    const divOpen = ()=>{
      if(open === "hidden"){
        setOpen("block");
      }else{
        setOpen("hidden");
      }
    }
  return (
    <div className="w-full flex justify-between items-center p-6 sm:p-6 sm:px-24 absolute top-0 left-0">
      <img
        onClick={() => navigate("/")}
        src={assets.logo_big}
        alt="Logo"
        className="w-20 rounded-full sm:w-20 hover:cursor-pointer"
      />

      {/* This is dynamic if user is logged in means data is availael or authenticated than show profile if not than show login pannel */}
      {userData ? (
        <div onClick={divOpen} className="w-8 h-8 flex text-sm justify-center items-center rounded-full bg-black text-white cursor-pointer relative group">
          {/* Get userdata dynamic with only first capital letter */}
          <h1>{userData.name.charAt(0).toUpperCase()}</h1>
          
          {/* Profile Box after hover or click in mobile */}
          <div className={`absolute group-hover:block top-0 right-0 z-10 text-black rounded pt-10 ${open}`}  >
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                
                {/* Dynamic Show if Verify and not There 2 way of condition but its best for there are */}
                {!userData.isAccountVarified && <li onClick={sendVarificationOtp} className="py-1 px-2 hover:bg-gray-200 active:bg-gray-200 cursor-pointer select-none">Verify Email</li> }
                <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 active:bg-gray-200 cursor-pointer pr-12">Logout</li>
              </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-3 text-gray-800 hover:bg-gray-100 active:bg-gray-100 transition-all cursor-pointer"
        >
          Login <ChevronRight />{" "}
        </button>
      )}
    </div>
  );
};

export default NavBar;
