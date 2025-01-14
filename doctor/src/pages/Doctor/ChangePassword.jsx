import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";

const ChangePassword = () => {
  const { backendUrl, cookie } = useContext(DoctorContext);
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
      const data = await axios.post(
        `${backendUrl}/api/doctor/change-password`,
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
      <form className="max-h-[90vh]" onSubmit={(e) => onSubmitHandler(e)}>
        <div className="p-5">
          <p className="text-lg font-medium">
            <span className="text-primary">Doctor</span> Change Password
          </p>
          <div className="mt-7 sm:w-80 flex flex-col gap-6  bg-white rounded-lg border justify-center p-8">
            <div className="relative">
              <p className="font-medium  mb-2">Old Password:</p>
              <input
                className="relative p-2 w-full bg-indigo-100 rounded-md outline-none focus:border-2 focus:border-primary"
                type={`${showPassword ? "text" : "password"}`}
                value={oldPassword}
                placeholder="Enter Old Password"
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              {oldPassword && (
                <button
                  onClick={togglePasswordVisibility}
                  type="button"
                  className="absolute  inset-y-[52px] right-3 flex items-center text-gray-500 hover:text-blue-500">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              )}
            </div>
            <div className="relative">
              <p className="font-medium mb-2">New Password:</p>
              <input
                className="w-full relative p-2 bg-indigo-100 rounded-md focus:border-2 focus:border-primary outline-none "
                type={`${showNewPassword ? "text" : "password"}`}
                value={newPassword}
                placeholder="Enter New Password"
                required
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {newPassword && (
                <button
                  onClick={toogleNewPasswordVisibility}
                  type="button"
                  className="absolute  inset-y-[52px] right-3 flex items-center text-gray-500 hover:text-blue-500">
                  {showNewPassword ? "🙈" : "👁️"}
                </button>
              )}
            </div>
            <button className="bg-primary text-base rounded-lg w-full p-2 text-white  outline-none">
              Change Password
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
