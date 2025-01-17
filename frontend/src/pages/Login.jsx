import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { setCookie, cookie, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Sign up") {
        const data = await axios.post(
          `${backendUrl}/api/user/user-register`,
          {
            fullName: String(name),
            email: String(email),
            password: String(password),
          },
          {
            withCredentials: true,
          }
        );

        console.log(data);
        const cookie = Cookies.get("accessToken");
        if (data.data.success) {
          localStorage.setItem("access-token", cookie);
          setCookie(cookie);
          toast.success(data.data.message);
          navigate("/");
        } else {
          toast.error(data.data.message);
        }
      }

      if (state === "Login") {
        const data = await axios.post(
          `${backendUrl}/api/user/user-login`,
          {
            email: String(email),
            password: String(password),
          },
          {
            withCredentials: true,
          }
        );

        console.log(data);

        const cookie = Cookies.get("accessToken");

        console.log(cookie);

        if (data.data.success) {
          localStorage.setItem("access-token", cookie);
          setCookie(cookie);
          toast.success(data.data.message);
          navigate("/");
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

  useEffect(() => {
    // Redirect logged-in users to the home page
    if (cookie) {
      navigate("/");
    }
  }, [cookie, navigate]);

  return (
    <form
      onSubmit={(e) => onSubmitHandler(e)}
      className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto border items-start p-6 min-w-[300px] sm:min-w-[396PX] rounded-2xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign up" ? "Create account" : "Login"}
        </p>
        <p>
          Please {state === "Sign up" ? "sign up" : "login"} to book an
          appointment
        </p>
        {state === "Sign up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(event) => setName(event.target.value)}
              value={name}
              placeholder="Enter your name"
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
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
              className="absolute inset-y-[43px] right-3 flex items-center text-gray-500 hover:text-blue-500">
              {showPassword ? "🙈" : "👁️"}
            </button>
          )}
        </div>
        <button className="bg-primary text-base rounded-lg w-full p-2 text-white outline-none">
          {state === "Sign up" ? "Create Account" : "Login"}
        </button>
        {state === "Login" && (
          <p>
            Forgot Password?{" "}
            <Link className="cursor-pointer text-primary" to="/forgot-password">
              Click here
            </Link>
          </p>
        )}
        {state === "Sign up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="cursor-pointer text-primary">
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign up")}
              className="text-primary cursor-pointer">
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
