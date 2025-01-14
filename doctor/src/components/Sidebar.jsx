import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

const Sidebar = () => {
  const { cookie } = useContext(DoctorContext);

  return (
    <div className="min-h-screen min-w-10 bg-white border-r">
      {cookie && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-start gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-primary " : ""
              }`
            }
            to={"/doctor-dashboard"}>
            <img src={assets.home_icon} alt="home_icon" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-start gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-primary " : ""
              }`
            }
            to={"/doctor-appointment"}>
            <img src={assets.appointment_icon} alt="appointment_icon" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-start gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-primary " : ""
              }`
            }
            to={"/doctor-profile"}>
            <img src={assets.people_icon} alt="doctor_list" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-start gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-primary " : ""
              }`
            }
            to={"/change-password"}>
            <img src={assets.people_icon} alt="doctor_list" />
            <p className="hidden md:block">Change Password</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
