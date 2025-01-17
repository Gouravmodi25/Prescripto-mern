import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const {
    cookie,
    dashData,
    getDashData,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (cookie) {
      getDashData();
      const interval = setInterval(() => {
        getDashData(); // Periodic fetch
      }, 5000); // Fetch every 5 seconds

      return () => clearInterval(interval);
    }
  }, [cookie]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2 bg-white p-4 rounded border-2 border-gray-100 min-w-52 cursor-pointer hover:scale-105 transition-all duration-200">
            <img className="w-14" src={assets.earning_icon} alt="doctor_icon" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                $ {dashData.earning}
              </p>
              <p className="text-gray-400">Earning</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 rounded border-2 border-gray-100 min-w-52 cursor-pointer hover:scale-105 transition-all duration-200">
            <img
              className="w-14"
              src={assets.appointments_icon}
              alt="doctor_icon"
            />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointment}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 rounded border-2 border-gray-100 min-w-52 cursor-pointer hover:scale-105 transition-all duration-200">
            <img
              className="w-14"
              src={assets.patients_icon}
              alt="doctor_icon"
            />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patient}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            getDashData();
            toast.success("Refreshed Appointment Data");
            window.location.reload();
          }}
          className="mb-3 px-4 py-2 bg-blue-500 text-white rounded">
          Refresh Appointments
        </button>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-6 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="list_icon" />
            <p className="font-semibold">Latest Booking</p>
          </div>

          <div className="border border-t-0 pt-4 max-h-[60vh] overflow-y-scroll">
            {dashData.latestAppointment &&
            dashData.latestAppointment.length > 0 ? (
              dashData.latestAppointment.map((item, index) => (
                <div
                  className="flex items-center px-6 py-3 gap-3 hover:bg-gray-200"
                  key={index}>
                  <img
                    className="rounded-full w-10"
                    src={item.userData.profile_image}
                    alt=""
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-gray-800">
                      {item.userData.fullName.toUpperCase()}
                    </p>
                    <p className="text-gray-600">
                      Booking on {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                  {item.isComplete && !item.cancelled ? (
                    <p className="text-green-500 text-sm font-medium">
                      Completed
                    </p>
                  ) : item.cancelled ? (
                    <p className="text-red-500 text-sm font-medium">
                      Cancelled
                    </p>
                  ) : (
                    <div className="flex gap-1">
                      <img
                        onClick={() => completeAppointment(item._id)}
                        src={assets.tick_icon}
                        className="w-10 h-10 cursor-pointer"
                        alt="Cancel Appointment"
                      />
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        src={assets.cancel_icon}
                        className="w-10 h-10 cursor-pointer"
                        alt="Cancel Appointment"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No appointments found.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
