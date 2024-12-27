import { useContext } from "react";
import { assets } from "../assets/assets.js";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { cookie, setCookie, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  const logout = async () => {
    navigate("/");
    const data = await axios.post(
      `${backendUrl}/api/admin/admin-loggedOut`,
      {},
      {
        headers: {
          Authorization: `${cookie}`, // Include token in headers
        },
        withCredentials: false,
      }
    );

    Cookies.remove("accessToken");

    console.log(data);

    if (data.data.success) {
      toast.success(data.data.message);
    }

    cookie && setCookie("");
    cookie && localStorage.removeItem("access-token");
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img className="w-36 sm:w-40 cursor-pointer" src={assets.admin_logo} />
        <p className="border rounded-full px-2.5 py-0.5 border-gray-500 text-gray-600">
          {cookie ? "Admin" : "Doctor"}
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
