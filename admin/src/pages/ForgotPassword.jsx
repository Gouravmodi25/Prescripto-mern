import axios from "axios";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { backendUrl } = useContext(AdminContext);
  const [email, setEmail] = useState("");

  const onSubmitHandler = async function (event) {
    event.preventDefault();

    const data = await axios.post(
      `${backendUrl}/api/admin/admin-forgotPassword`,
      { email: String(email) }
    );

    if (data.data.success) {
      toast.success(data.data.message);
      console.log(data.data.data);
    } else {
      toast.error(data.data.message);
    }
  };

  return (
    <>
      <form
        onSubmit={(event) => onSubmitHandler(event)}
        className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-3 m-auto border  items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl text-zinc-600 text-sm shadow-lg">
          <p className="text-2xl font-semibold m-auto">
            <span className="text-primary">Admin</span> Forgot Password
          </p>

          <div className="w-96">
            <p>
              Please enter the email address you register your account with. We
              will send you reset password confirmation to this email
            </p>
          </div>

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
          <button className="bg-primary text-base rounded-lg w-full p-2 text-white  outline-none">
            Send Email
          </button>
          <div>
            <p>
              Create an new account?{" "}
              <Link to="/" className="text-primary cursor-pointer">
                Click here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default ForgotPassword;
