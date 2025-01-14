import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { useEffect } from "react";
import { assets } from "../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";

const Dashboard = () => {
  const {
    cancelledAppointment,
    dashData,
    toGetDashboardData,
    cookie,
    getAllAppointments,
  } = useContext(AdminContext);

  const { slotDateFormat } = useContext(AppContext);

  let appointmentData = dashData.latestAppointment;

  useEffect(() => {
    if (cookie) {
      toGetDashboardData();
    }
  }, [cookie]);

  useEffect(() => {
    getAllAppointments();
  }, [dashData]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3 ">
          <div className="flex items-center gap-2 bg-white p-4 rounded border-2 border-gray-100 min-w-52 cursor-pointer hover:scale-105 transition-all duration-200">
            <img className="w-14" src={assets.doctor_icon} alt="doctor_icon" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-gray-400">Doctors</p>
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
                {dashData.appointments}
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

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-6 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="list_icon" />
            <p className="font-semibold">Latest Booking</p>
          </div>

          <div className="border border-t-0 pt-4 max-h-[60vh] overflow-y-scroll">
            {appointmentData && appointmentData.length > 0 ? (
              appointmentData.map((item, index) => (
                <div
                  className="flex items-center px-6 py-3 gap-3 hover:bg-gray-200"
                  key={index}>
                  <img
                    className="rounded-full w-10"
                    src={item.doctorData.profile_image}
                    alt=""
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-gray-800">
                      {item.doctorData.fullName.toUpperCase()}
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
                    <img
                      onClick={() => cancelledAppointment(item._id)}
                      src={assets.cancel_icon}
                      className="w-10 h-10 cursor-pointer"
                      alt="Cancel Appointment"
                    />
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

export default Dashboard;
