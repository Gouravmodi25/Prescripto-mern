import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = function (props) {
  const [cookie, setCookie] = useState(
    localStorage.getItem("access-token")
      ? localStorage.getItem("access-token")
      : ""
  );

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState([]);

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
      const response = await axios.get(
        `${backendUrl}/api/admin/get-all-appointments`,
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (response.data.success) {
        setAppointments(response.data.data.reverse());

        // Update dashData.latestAppointment if needed
        setDashData((prevState) => ({
          ...prevState,
          latestAppointment: response.data.data,
        }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data.message || "Unable to fetch appointments."
      );
    }
  };

  // for cancelled appointment by admin
  const cancelledAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/cancelled-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // Update dashData.latestAppointment locally
        const updatedAppointments = dashData.latestAppointment.map((appt) =>
          appt._id === appointmentId ? { ...appt, cancelled: true } : appt
        );

        setDashData((prevState) => ({
          ...prevState,
          latestAppointment: updatedAppointments,
        }));

        // Optional: Re-fetch appointments for consistency
        getAllAppointments();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong.");
    }
  };

  // get dashboard data

  const toGetDashboardData = async () => {
    try {
      const data = await axios.get(
        `${backendUrl}/api/admin/get-dashboard-data`,
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        setDashData(data.data.data);
        getAllAppointments();
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("access-token");
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
    dashData,
    toGetDashboardData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
