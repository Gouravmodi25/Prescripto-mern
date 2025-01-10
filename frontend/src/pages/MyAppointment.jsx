import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const MyAppointment = () => {
  const { doctors } = useContext(AppContext);
  return (
    <div>
      <p className="pb-3 mt-12 border-b font-medium text-zinc-700">
        My Appointment
      </p>
      <div>
        {doctors.slice(0, 5).map((item) => {
          return (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b mt-3 pb-3"
              key={item._id}>
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.profile_image}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">
                  {item.fullName.toUpperCase()}
                </p>
                <p>{item.speciality.toUpperCase()}</p>
                <p className="text-neutral-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.address.line1}</p>
                <p className="text-xs">{item.address.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm mt-1 text-neutral-700 font-medium">
                    Date & Time:
                  </span>
                  25 July, 2024 | 8:30 PM
                </p>
              </div>
              <div></div>
              <div className="flex flex-col justify-end gap-2">
                <button className="text-stone-500 text-sm sm:min-w-48 py-2 text-center border rounded-md hover:bg-primary hover:text-white transition-all duration-300">
                  Pay Online
                </button>
                <button className="text-stone-500 text-sm sm:min-w-48 py-2 text-center border rounded-md hover:bg-red-600 hover:text-white transition-all duration-300">
                  Cancel appointment
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointment;
