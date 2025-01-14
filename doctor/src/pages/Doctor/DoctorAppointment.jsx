import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const DoctorAppointment = () => {
  const {
    cookie,
    appointmentData,
    getAppointmentData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  //   const { calculateAge, slotDateFormat } = useContext(AppContext);

  //   console.log(calculateAge);

  const { calculateAge, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (cookie) {
      getAppointmentData();
      const interval = setInterval(() => {
        getAppointmentData(); // Periodic fetch
      }, 5000); // Fetch every 5 seconds

      return () => clearInterval(interval);
    }
  }, [cookie]);

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <button
        onClick={() => {
          getAppointmentData();
          toast.success("Refreshed Appoinment Data");
          window.location.reload();
        }}
        className="mb-3 px-4 py-2 bg-blue-500 text-white rounded">
        Refresh Appointments
      </button>
      <div className="bg-white border rounded text-sm max-h-[90vh] min-h-[70vh] overflow-y-scroll">
        <div className=" max-sm:hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr]  px-6 py-3 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {console.log(appointmentData)}
        {appointmentData && appointmentData.length > 0 ? (
          appointmentData.map((item, index) => (
            <div
              className=" flex flex-wrap justify-between max-sm:gap-3 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr]  gap-1 items-center text-gray-500 px-2 py-6 border-b hover:bg-gray-200"
              key={item._id || index}>
              <p className="max-sm:hidden">{index + 1}</p>

              <div className="flex items-center gap-2">
                <img
                  className="w-8 h-8 rounded-full"
                  src={item.userData?.profile_image || assets.default_user_icon}
                  alt="Patient"
                />
                <p>{item.userData?.fullName?.toUpperCase() || "Unknown"}</p>
              </div>

              <div>
                <p className="text-sm inline border border-primary rounded-full px-2">
                  {item.payment ? "Online" : "CASH"}
                </p>
              </div>

              <p className="max-sm:hidden">
                {calculateAge(item.userData["date_of_birth"])}
              </p>

              <p>
                {item.slotDate ? slotDateFormat(item.slotDate) : "N/A"}{" "}
                {item.slotTime || ""}
              </p>
              <p>${item.amount || "0.00"}</p>

              {item.cancelled ? (
                <p className="text-red-500 border border-red-500 p-2 rounded-lg text-sm font-medium">
                  Cancelled
                </p>
              ) : (
                <div className="flex gap-1">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt=""
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
