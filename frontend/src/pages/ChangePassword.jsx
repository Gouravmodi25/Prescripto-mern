import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const ChangePassword = () => {
  const { backendUrl, cookie } = useContext(AppContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toogleNewPasswordVisibility = () => {
    setShowNewPassword((previous) => !previous);
  };

  const onSubmitHandler = async function (event) {
    event.preventDefault();
    try {
      const data = await axios.patch(
        `${backendUrl}/api/user/user-change-password`,
        { oldPassword: String(oldPassword), newPassword: String(newPassword) },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        toast.success(data.data.message);
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(data.data.message);
        setOldPassword("");
        setNewPassword("");
      }
    } catch (error) {
      toast.error(error?.response.data.message);
      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <>
      <form
        onSubmit={(event) => onSubmitHandler(event)}
        className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-3 m-auto border  items-start p-6 min-w-[300px] sm:min-w-[396PX] rounded-2xl text-zinc-600 text-sm shadow-lg">
          <p className="text-2xl font-semibold m-auto">
            <span className="text-primary">User</span> Change Password
          </p>
          <div className="relative w-full">
            <p>Old Password</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setOldPassword(e.target.value)}
              value={oldPassword}
              placeholder="Enter your old password"
              required
            />
            {oldPassword && (
              <button
                onClick={togglePasswordVisibility}
                type="button"
                className="absolute  inset-y-[43px] right-3 flex items-center text-gray-500 hover:text-blue-500">
                {showPassword ? "🙈" : "👁️"}
              </button>
            )}
          </div>
          <div className="relative w-full">
            <p>Confirm Password</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type={showNewPassword ? "text" : "password"}
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              placeholder="Enter your new password"
              required
            />
            {newPassword && (
              <button
                onClick={toogleNewPasswordVisibility}
                type="button"
                className="absolute  inset-y-[43px] right-3 flex items-center text-gray-500 hover:text-blue-500">
                {showNewPassword ? "🙈" : "👁️"}
              </button>
            )}
          </div>
          <button className="bg-primary text-base rounded-lg w-full p-2 text-white  outline-none">
            Change Password
          </button>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
