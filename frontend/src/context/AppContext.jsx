import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { doctors } from "../assets/assets";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
  const [cookie, setCookie] = useState(
    localStorage.getItem("access-token")
      ? localStorage.getItem("access-token")
      : ""
  );
  const [userData, setUserData] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctor = async () => {
    try {
      const data = await axios.get(`${backendUrl}/api/doctor/all-doctor-list`);

      if (data.data.success) {
        // toast.success(data.data.message);
        setDoctors(data.data.data);
      }
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };

  const loadUserData = async function () {
    try {
      const data = await axios.get(`${backendUrl}/api/user/get-details`, {
        headers: {
          Authorization: `${cookie}`,
        },
      });

      if (data.data.success) {
        setUserData(data.data.data);
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  const value = {
    doctors,
    currencySymbol,
    backendUrl,
    getAllDoctor,
    cookie,
    setCookie,
    userData,
    setUserData,
    loadUserData,
  };

  useEffect(() => {
    if (cookie) {
      loadUserData();
    } else {
      setUserData(false);
    }
  }, [cookie]);

  useEffect(() => {
    const savedToken = localStorage.getItem("access-token");
    if (savedToken) {
      setCookie(savedToken);
    }
  }, []);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
