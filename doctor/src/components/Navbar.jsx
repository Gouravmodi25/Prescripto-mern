import { useContext } from "react";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext.jsx";

const Navbar = () => {
  const { cookie, setCookie, backendUrl } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Call the logout API
      const response = await axios.post(
        `${backendUrl}/api/admin/admin-loggedOut`,
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
        window.location.reload();
      } else {
        toast.warn("Logout API responded but did not succeed.");
      }
    } catch (error) {
      console.error("Logout error:", error.response.data.message);
      toast.error("Failed to log out. Please try again.");
      Cookies.remove("accessToken");
      localStorage.removeItem("access-token");
      window.location.reload();
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
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img className="w-36 sm:w-40 cursor-pointer" src={assets.admin_logo} />
        <p className="border rounded-full px-2.5 py-0.5 border-gray-500 text-gray-600">
          Doctor
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-primary text-white text-sm md:px-10  px-4 py-2 rounded-full">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
