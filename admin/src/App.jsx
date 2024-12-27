import { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";

const App = () => {
  const { cookie } = useContext(AdminContext);
  return cookie ? (
    <div className="bg-[#f8f9fd]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
