import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { doctors } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([]);
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctor = async () => {
    try {
      const data = await axios.get(`${backendUrl}/api/doctor/all-doctor-list`);

      if (data.data.success) {
        toast.success(data.data.message);
        setDoctors(data.data.data);
        console.log(data.data.data);
      }
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };
  const value = {
    doctors,
    currencySymbol,
    backendUrl,
    getAllDoctor,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
