import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
export const AppContent = createContext();

export const AppContextProvider = (props) => {
  //importing backend url from .env file
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  // Function gor checking already login or not means authentication
  const getAuthState = async ()=>{
    try {
      // use api for getting data
      const {data} = await axios.get(backendUrl + '/api/auth/is-auth' , {withCredentials:true});

        if(data.success){
            setIsLoggedIn(true);
            getUserData();
        }  


    } catch (error) {
      toast.error(error.message);
    }
  };

  //getting user data from database
  const getUserData = async () => {

    //  axios.defaults.withCredentials = true

    try {

      
      const { data } = await axios.get(backendUrl + "/api/user/data" ,{withCredentials:true});

      data.success ? setUserData(data.userData) : toast.error(data.message);

      // console.log("🔥 getUserData FUNCTION CALLED");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(()=>{
    getAuthState();
  },[]);

  const value = {
    backendUrl, //VITE_BACKEND_URL
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
