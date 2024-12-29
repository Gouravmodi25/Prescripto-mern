import axios from "axios";
import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AdminContext);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetToken } = useParams();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toogleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((previous) => !previous);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    console.log(resetToken);

    try {
      const data = await axios.post(
        `${backendUrl}/api/admin/resetPassword/${resetToken}`,
        {
          newPassword: String(password),
          confirmNewPassword: String(confirmPassword),
        }
      );

      if (data.data.success) {
        setSuccess(true);
        setPassword("");
        setConfirmPassword("");
        toast.success(data.data.message);
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <form
        onSubmit={(event) => onSubmitHandler(event)}
        className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-3 m-auto border  items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl text-zinc-600 text-sm shadow-lg">
          <p className="text-2xl font-semibold m-auto">
            <span className="text-primary">Admin</span> Reset Password
          </p>
          <div className="relative w-full">
            <p>New Password</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter your password"
              required
            />
            {password && (
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
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder="Enter your password"
              required
            />
            {confirmPassword && (
              <button
                onClick={toogleConfirmPasswordVisibility}
                type="button"
                className="absolute  inset-y-[43px] right-3 flex items-center text-gray-500 hover:text-blue-500">
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            )}
          </div>
          <button className="bg-primary text-base rounded-lg w-full p-2 text-white  outline-none">
            Reset Password
          </button>
          {success ? (
            <p>
              Login?
              <Link to="/" className="cursor-pointer text-primary">
                Click Here
              </Link>
            </p>
          ) : (
            <></>
          )}
        </div>
      </form>
    </>
  );
};

export default ResetPassword;
