import { createContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = function (props) {
  const [cookie, setCookie] = useState(
    Cookies.get("accessToken") ? Cookies.get("accessToken") : ""
  );

  const [doctors, setDoctors] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctor = async function () {
    try {
      const data = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        {
          headers: {
            Authorization: `${cookie}`, // Include token in headers
          },
          withCredentials: false,
        }
      );

      if (data.data.success) {
        setDoctors(data.data.data);
        // toast.success("Doctor Loaded Successfully");
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const value = {
    cookie,
    setCookie,
    backendUrl,
    doctors,
    getAllDoctor,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
