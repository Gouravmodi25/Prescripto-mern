import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointment = () => {
  const { backendUrl, cookie } = useContext(AppContext);

  const [appointments, setAppointment] = useState([]);

  const navigate = useNavigate();

  const getUserAppointment = async () => {
    try {
      const data = await axios.get(
        `${backendUrl}/api/user/list-of-appointment`,
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        setAppointment(data.data.data.reverse());
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
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

    const dateArray = slotDate.split("_");

    return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]} ${
      dateArray[2]
    }`;
  };

  // for cancel appointment

  const cancelledAppointment = async (appointmentId) => {
    try {
      console.log(appointmentId);

      const data = await axios.patch(
        `${backendUrl}/api/user/to-cancel-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      console.log(data);

      if (data.data.success) {
        toast.success(data.data.message);
        getUserAppointment();
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  // init payment

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
        console.log(response);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // appointment payment by razorpay

  const appointmentRazorpay = async (appointmentId) => {
    try {
      console.log(appointmentId);
      const data = await axios.post(
        `${backendUrl}/api/user/payment`,
        { appointmentId },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        console.log(data);
        initPay(data.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cookie) {
      getUserAppointment();
    }
  }, [cookie]);

  useEffect(() => {
    console.log(appointments);

    const doctorData = appointments[0];
    console.log(doctorData);
  }, [appointments]);

  if (appointments == []) return <div>Loading...</div>;

  return (
    <div>
      <p className="pb-3 mt-12 border-b font-medium text-zinc-700">
        My Appointment
      </p>
      {appointments && (
        <div>
          {appointments.map((item) => {
            return (
              <div
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b mt-3 pb-3"
                key={item._id}>
                <div>
                  <img
                    onClick={() =>
                      navigate(`/appointment/${item.doctorData["_id"]}`)
                    }
                    className="w-32 bg-indigo-50"
                    src={item.doctorData["profile_image"]}
                    alt=""
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
                    <span className="text-sm mt-1 text-neutral-700 font-medium">
                      Date & Time:
                    </span>{" "}
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                </div>
                <div></div>
                <div className="flex flex-col justify-end gap-2">
                  {!item.cancelled && (
                    <button
                      onClick={() => appointmentRazorpay(item._id)}
                      className="text-stone-500 text-sm sm:min-w-48 py-2 text-center border rounded-md hover:bg-primary hover:text-white transition-all duration-300">
                      Pay Online
                    </button>
                  )}
                  {!item.cancelled && (
                    <button
                      onClick={() => cancelledAppointment(item._id)}
                      className="text-stone-500 text-sm sm:min-w-48 py-2 text-center border rounded-md hover:bg-red-600 hover:text-white transition-all duration-300">
                      Cancel appointment
                    </button>
                  )}
                  {item.cancelled && (
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                      Appointment Cancelled
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;
