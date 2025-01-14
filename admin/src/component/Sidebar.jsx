import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const { cookie } = useContext(AdminContext);

  return (
    <div className="min-h-screen bg-white border-r">
      {cookie && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-start gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-primary " : ""
              }`
            }
            to={"/admin-dashboard"}>
            <img src={assets.home_icon} alt="home_icon" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-start gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-primary " : ""
              }`
            }
            to={"/all-appointment"}>
            <img src={assets.appointment_icon} alt="appointment_icon" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-start gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-primary " : ""
              }`
            }
            to={"/add-doctor"}>
            <img src={assets.add_icon} alt="add_icon" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-start gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-primary " : ""
              }`
            }
            to={"/doctor-list"}>
            <img src={assets.people_icon} alt="doctor_list" />
            <p className="hidden md:block">Doctors List</p>
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
