import { useContext } from "react";
import AdminLogin from "./pages/AdminLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  const { cookie } = useContext(AdminContext);
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {cookie ? (
          <Route
            path="/"
            element={
              <div className="bg-[#f8f9fd]">
                <Navbar />
                <div className="flex items-start">
                  <Sidebar />
                </div>
              </div>
            }
          />
        ) : (
          <Route path="/" element={<AdminLogin />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
