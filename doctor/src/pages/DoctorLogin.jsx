import { useState, useContext, useEffect } from "react";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const DoctorLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { cookie, setCookie, backendUrl } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const data = await axios.post(
        `${backendUrl}/api/doctor/login`,
        {
          email: String(email),
          password: String(password),
        },
        {
          withCredentials: true, // Ensures the cookie is sent with the request
        }
      );

      if (data.data.success) {
        localStorage.setItem("access-token", data.data.data.accessToken);
        setCookie(data.data.data.accessToken);
        toast.success(data.data.message);
        console.log(data.data.data);
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    console.log(cookie);
  }, [cookie]);
  return (
    <form
      onSubmit={(event) => onSubmitHandler(event)}
      className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto border  items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">Doctor </span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            className="border b`order-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="relative w-full">
          <p>Password</p>
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
        <button className="bg-primary text-base rounded-lg w-full p-2 text-white  outline-none">
          Login
        </button>
        <div>
          <p className=" pb-3">
            Forgot Password?{" "}
            <Link to="/forgot-password" className="text-primary cursor-pointer">
              Click here
            </Link>{" "}
          </p>
        </div>
      </div>
    </form>
  );
};

export default DoctorLogin;
