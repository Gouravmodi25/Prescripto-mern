import { createContext, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = function (props) {
  const [accessToken, setAccessToken] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const value = {
    accessToken,
    setAccessToken,
    backendUrl,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
