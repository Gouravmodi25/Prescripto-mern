import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const AdminLogin = () => {
  const [state, setState] = useState("Sign up");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { setCookie, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Login") {
        const data = await axios.post(
          `${backendUrl}/api/admin/admin-loggedIn`,
          {
            email: String(email),
            password: String(password),
          },
          {
            withCredentials: true, // Ensures the cookie is sent with the request
          }
        );
        const cookie = Cookies.get("accessToken");
        console.log(cookie);
        console.log(data);
        if (data.data.success) {
          localStorage.setItem("access-token", cookie);
          setCookie(cookie);
          toast.success(data.data.message);
          console.log(data.data.data);
        } else {
          toast.error(data.data.message);
        }
      }
      if (state === "Sign up") {
        const data = await axios.post(
          `${backendUrl}/api/admin/register-admin`,
          {
            fullName: String(name),
            email: String(email),
            password: String(password),
          },
          {
            withCredentials: true, // Ensures the cookie is sent with the request
          }
        );
        const cookie = Cookies.get("accessToken");
        console.log(cookie);

        console.log(data.data.message);
        if (data.data.success) {
          localStorage.setItem("access-token", cookie);
          setCookie(cookie);
          toast.success(data.data.message);
          console.log(data);
        } else {
          toast.error(data.data.message);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form
      onSubmit={(event) => onSubmitHandler(event)}
      className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto border  items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">Admin</span>
          {state == "Sign up" ? "Create account" : "Login"}{" "}
        </p>

        {state === "Sign up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border b`order-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your Name"
              required
            />
          </div>
        )}

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
          {state == "Sign up" ? "Create Account" : "Login"}
        </button>
        {state == "Sign up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="cursor-pointer text-primary">
              Login here
            </span>
          </p>
        ) : (
          <div>
            <p className=" pb-3">
              Forgot Password?{" "}
              <span className="text-primary cursor-pointer">Click here</span>{" "}
            </p>
            <p>
              Create an new account?{" "}
              <span
                onClick={() => setState("Sign up")}
                className="text-primary cursor-pointer">
                Click here
              </span>
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

export default AdminLogin;
