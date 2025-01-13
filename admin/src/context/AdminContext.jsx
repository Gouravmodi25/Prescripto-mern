import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = function (props) {
  const [cookie, setCookie] = useState(
    Cookies.get("accessToken") ? Cookies.get("accessToken") : ""
  );

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

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

  // get all appointments

  const getAllAppointments = async () => {
    try {
      const data = await axios.get(
        `${backendUrl}/api/admin/get-all-appointments`,
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        setAppointments(data.data.data);
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  // for cancelled appointment by admin
  const cancelledAppointment = async (appointmentId) => {
    try {
      const data = await axios.post(
        `${backendUrl}/api/admin/cancelled-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        toast.success(data.data.message);
        getAllAppointments();
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    const savedToken = Cookies.get("accessToken");
    if (savedToken) {
      setCookie(savedToken);
    }
  }, []);

  const value = {
    cookie,
    setCookie,
    backendUrl,
    doctors,
    getAllDoctor,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelledAppointment,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
