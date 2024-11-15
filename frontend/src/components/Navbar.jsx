import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);
  return (
    <div className="flex items-center justify-between py-5 mb-5 text-sm border-b border-b-gray-500">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="logo-image"
      />
      <ul className="hidden md:flex  items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden transition duration-500 ease-in-out transform" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTOR</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden transition duration-500 ease-in-out transform" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden transition duration-500 ease-in-out transform" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden transition duration-500 ease-in-out transform" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 rounded-full"
              src={assets.profile_pic}
              alt="profile_pic"
            />
            <img
              className="w-2.5 "
              src={assets.dropdown_icon}
              alt="dropDownIcon"
            />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-500 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 flex flex-col gap-4  p-4 rounded">
                <p
                  onClick={() => navigate("my-profile")}
                  className="hover:text-black cursor-pointer">
                  My Profile
                </p>
                <p
                  onClick={() => navigate("my-appointment")}
                  className="hover:text-black cursor-pointer">
                  MyAppointment
                </p>
                <p
                  onClick={() => setToken(false)}
                  className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary px-8 py-3 text-[15px] text-white font-light hidden md:block rounded-full">
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
