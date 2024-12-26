import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";

const Login = () => {
  const [state, setState] = useState("Sign up");
  const [adminState, setAdminState] = useState("Admin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { setAccessToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === "Login" && adminState === "Admin") {
      const data = await axios.post(`${backendUrl}/api/admin/admin-loggedIn`, {
        email: String(email),
        password: String(password),
      });
      console.log(data.data.data);
    }
    if (state === "Sign up" && adminState === "Admin") {
      const data = await axios.post(`${backendUrl}/api/admin/register-admin`, {
        fullName: String(name),
        email: String(email),
        password: String(password),
      });
      console.log(data.data.data);
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
          <span className="text-primary">
            {adminState == "Admin" ? "Admin" : "Doctor"}{" "}
          </span>
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
        {adminState == "Admin" ? (
          <p className="">
            Doctor Login?{" "}
            <span
              className="text-primary cursor-pointer "
              onClick={() => setAdminState("Doctor")}>
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-primary cursor-pointer "
              onClick={() => setAdminState("Admin")}>
              Click Here
            </span>
          </p>
        )}
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
            <p className="text-primary cursor-pointer pb-3">Change Password</p>
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

export default Login;
