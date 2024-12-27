import { createContext, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = function (props) {
  const [cookie, setCookie] = useState(
    localStorage.getItem("access-token")
      ? localStorage.getItem("access-token")
      : ""
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const value = {
    cookie,
    setCookie,
    backendUrl,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
