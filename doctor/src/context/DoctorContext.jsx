import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

export const DoctorContext = createContext(null);

const DoctorContextProvider = (props) => {
  const [cookie, setCookie] = useState(
    localStorage.getItem("access-token")
      ? localStorage.getItem("access-token")
      : ""
  );
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [appointmentData, setAppointmentData] = useState([]);

  const [dashData, setDashData] = useState(false);

  const [profileData, setProfileData] = useState(false);

  const getAppointmentData = async () => {
    try {
      const data = await axios.post(
        `${backendUrl}/api/doctor/get-appointment-data`,
        {},
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        setAppointmentData(data.data.data.reverse());
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.data);
    }
  };

  // complete appointment

  const completeAppointment = async (appointmentId) => {
    try {
      const data = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        toast.success(data.data.message);
        getAppointmentData();
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  // cancelled appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      // Optimistically update the state
      setAppointmentData((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId)
      );

      const data = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        toast.success(data.data.message);
        getAppointmentData(); // Ensure backend consistency
      } else {
        toast.error(data.data.message);
        getAppointmentData(); // Revert optimistic update if necessary
      }
    } catch (error) {
      toast.error(error.response?.data.message);
      getAppointmentData(); // Revert optimistic update on error
    }
  };

  // get dash data

  const getDashData = async () => {
    try {
      const data = await axios.get(
        `${backendUrl}/api/doctor/get-dashboard-data`,
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        setDashData(data.data.data);
      } else {
        toast.error(data.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data.data);
    }
  };

  const getProfileData = async () => {
    try {
      const data = await axios.get(`${backendUrl}/api/doctor/fetch-profile`, {
        headers: {
          Authorization: cookie,
        },
      });

      if (data.data.success) {
        setProfileData(data.data.data);
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  const value = {
    cookie,
    setCookie,
    backendUrl,
    appointmentData,
    setAppointmentData,
    getAppointmentData,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("access-token");
    if (savedToken) {
      setCookie(savedToken);
    }
  }, []);

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
