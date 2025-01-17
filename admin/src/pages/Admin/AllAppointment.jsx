import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets.js";

const AllAppointment = () => {
  const { cookie, appointments, getAllAppointments, cancelledAppointment } =
    useContext(AdminContext);

  const { calculateAge, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (cookie) {
      getAllAppointments();
      const interval = setInterval(() => {
        getAllAppointments(); // Periodic fetch
      }, 700); // Fetch every 5 seconds

      return () => clearInterval(interval);
    }
  }, [cookie]);

  return (
    <div className="w-full max-w-6xl m-3">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[90vh] min-h-[70vh] overflow-y-scroll">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_4fr_2fr_4fr_5fr_2fr_1fr] grid-flow-col px-6 py-3 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {/* Appointments List */}
        {appointments && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_4fr_2fr_4fr_5fr_2fr_1fr] text-gray-500 py-3 px-6 border-b hover:bg-gray-50 items-center"
              key={item._id || index}>
              {/* Index */}
              <p className="max-sm:hidden">{index + 1}</p>
              {/* Patient Info */}
              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full"
                  src={item.userData?.profile_image || assets.default_user_icon}
                  alt="Patient"
                />
                <p>{item.userData?.fullName?.toUpperCase() || "Unknown"}</p>
              </div>
              {/* Patient Age */}
              <p className="max-sm:hidden">
                {item.userData?.date_of_birth
                  ? calculateAge(item.userData.date_of_birth)
                  : "N/A"}
              </p>
              {/* Appointment Date & Time */}
              <p>
                {item.slotDate ? slotDateFormat(item.slotDate) : "N/A"}{" "}
                {item.slotTime || ""}
              </p>
              {/* Doctor Info */}
              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full bg-primary"
                  src={
                    item.doctorData?.profile_image || assets.default_doctor_icon
                  }
                  alt="Doctor"
                />
                <p>{item.doctorData?.fullName?.toUpperCase() || "Unknown"}</p>
              </div>
              {/* Appointment Fees */}
              <p>${item.amount || "0.00"}</p>
              {/* Cancel Appointment */}

              {item.isComplete && !item.cancelled ? (
                <p className="text-green-500 text-sm font-medium">Completed</p>
              ) : item.cancelled ? (
                <p className="text-red-500 text-sm font-medium">Cancelled</p>
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
          <p className="text-center text-gray-500">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default AllAppointment;
