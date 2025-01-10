import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "AppContext is undefined. Ensure AppContextProvider is wrapping the component tree."
    );
  }

  const { cookie, setCookie, backendUrl } = context;

  const logoutHandler = async () => {
    try {
      // Call the logout API
      const response = await axios.post(
        `${backendUrl}/api/user/user-logout`,
        {},
        {
          headers: {
            Authorization: `${cookie}`, // Include token in headers
          },
          withCredentials: false,
        }
      );

      // Handle API response
      if (response.data.success) {
        toast.success(response.data.message || "Logged out successfully!");
      } else {
        toast.warn("Logout API responded but did not succeed.");
      }
    } catch (error) {
      console.error("Logout error:", error.response.data.message);
      toast.error("Failed to log out. Please try again.");
    } finally {
      // Clear local storage and cookies
      Cookies.remove("accessToken");
      localStorage.removeItem("access-token");

      // Clear context state
      setCookie("");

      // Redirect to login page
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-between py-5 mb-5 text-sm border-b border-b-gray-500">
      <img
        onClick={() => navigate("/")}
        className="w-40 cursor-pointer"
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
        {cookie ? (
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
                  onClick={logoutHandler}
                  className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary px-6 py-3 text-[15px] text-white font-light hidden md:block rounded-full">
            Create Account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt="menu-icon"
        />
        {/* {mobile menu} */}
        <div
          className={`${
            showMenu ? "fixed w-full " : "w-0 h-0"
          }  md:hidden overflow-hidden right-0 top-0 bottom-0 z-20 bg-white transition-transform duration-500`}>
          <div className="flex items-center justify-between  py-5 px-6">
            <img
              className="w-36"
              onClick={() => {
                navigate("/");
                setShowMenu(false);
              }}
              src={assets.logo}
              alt="logo-image"
            />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="cross-icon"
            />
          </div>
          <ul className="flex flex-col text-lg font-medium mt-5 px-5 gap-3 items-center">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT US</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
