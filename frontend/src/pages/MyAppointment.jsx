import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointment = () => {
  const { backendUrl, cookie } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const getUserAppointment = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/user/list-of-appointment`,
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (response.data.success) {
        setAppointments(response.data.data.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    }
  };

  const slotDateFormat = (slotDate) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const [day, month, year] = slotDate.split("_");
    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/user/to-cancel-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // Update the `appointments` state locally
        const updatedAppointment = response.data.data; // Assuming the API returns updated appointment data
        setAppointments((prevAppointments) =>
          prevAppointments.map((appt) =>
            appt._id === updatedAppointment._id
              ? updatedAppointment // Replace with the updated appointment
              : appt
          )
        );
        await getUserAppointment();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const verifyResponse = await axios.post(
            `${backendUrl}/api/user/verify-razorpay-payment`,
            response,
            {
              headers: {
                Authorization: cookie,
              },
            }
          );

          if (verifyResponse.data.success) {
            getUserAppointment();
            navigate("/my-appointment");
            toast.success(verifyResponse.data.message);
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Payment verification failed"
          );
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayment = async (appointmentId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/payment`,
        { appointmentId },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (response.data.success) {
        initPay(response.data.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment initialization failed"
      );
    }
  };

  useEffect(() => {
    if (cookie) {
      getUserAppointment(); // Initial fetch

      const interval = setInterval(() => {
        getUserAppointment(); // Periodic fetch
      }, 700); // Fetch every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [cookie]);

  if (appointments.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p className="pb-3 mt-12 border-b font-medium text-zinc-700">
        My Appointment
      </p>
      {appointments.map((item) => (
        <div
          className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b mt-3 pb-3"
          key={item._id}>
          <div>
            <img
              onClick={() => navigate(`/appointment/${item.doctorData["_id"]}`)}
              className="w-32 bg-indigo-50 cursor-pointer"
              src={item.doctorData["profile_image"]}
              alt={`${item.doctorData["fullName"]} profile`}
            />
          </div>
          <div className="flex-1 text-sm text-zinc-600">
            <p className="text-neutral-800 font-semibold">
              {item.doctorData["fullName"].toUpperCase()}
            </p>
            <p>{item.doctorData["speciality"].toUpperCase()}</p>
            <p className="text-neutral-700 font-medium mt-1">Address:</p>
            <p className="text-xs">{item.doctorData["address"].line1}</p>
            <p className="text-xs">{item.doctorData["address"].line2}</p>
            <p className="text-xs mt-1">
              <span className="text-sm text-neutral-700 font-medium">
                Date & Time:
              </span>{" "}
              {slotDateFormat(item.slotDate)} | {item.slotTime}
            </p>
          </div>
          <div className="flex flex-col justify-end gap-2">
            {item.isComplete && !item.cancelled && (
              <button className="sm:min-w-48 py-2 border bg-green-100 rounded text-green-500">
                Completed
              </button>
            )}
            {!item.isComplete && !item.cancelled && item.payment && (
              <button className="sm:min-w-48 py-2 border bg-indigo-100 rounded text-green-500">
                Paid
              </button>
            )}
            {!item.isComplete && !item.cancelled && !item.payment && (
              <button
                onClick={() => handlePayment(item._id)}
                className="text-stone-500 text-sm sm:min-w-48 py-2 text-center border rounded-md hover:bg-primary hover:text-white transition-all duration-300">
                Pay Online
              </button>
            )}
            {!item.isComplete && !item.cancelled && (
              <button
                onClick={() => cancelAppointment(item._id)}
                className="text-stone-500 text-sm sm:min-w-48 py-2 text-center border rounded-md hover:bg-red-600 hover:text-white transition-all duration-300">
                Cancel Appointment
              </button>
            )}
            {item.cancelled && (
              <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                Appointment Cancelled
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAppointment;
