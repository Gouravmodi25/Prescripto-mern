import { useState } from "react";
import { createContext } from "react";

export const DoctorContext = createContext(null);

const DoctorContextProvider = (props) => {
  const [cookie, setCookie] = useState(
    localStorage.getItem("access-token")
      ? localStorage.getItem("access-token")
      : ""
  );
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = { cookie, setCookie, backendUrl };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
