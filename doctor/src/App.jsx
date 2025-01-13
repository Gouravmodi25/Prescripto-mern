import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { DoctorContext } from "./context/DoctorContext.jsx";
import ChangePassword from "./pages/Doctor/ChangePassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DoctorLogin from "./pages/DoctorLogin.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";

const AppLayout = ({ children }) => (
  <div className=" bg-[#f8f9fd]">
    <Navbar />
    <div className="flex items-start">
      <Sidebar />
      <div>{children}</div>
    </div>
  </div>
);

const App = () => {
  const { cookie } = useContext(DoctorContext);
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        {cookie ? (
          <Route
            path="*"
            element={
              <AppLayout className="box-border">
                <Routes>
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route
                    path="/doctor-dashboard"
                    element={<DoctorDashboard />}
                  />
                  <Route path="/doctor-profile" element={<DoctorProfile />} />
                  <Route
                    path="/doctor-appointment"
                    element={<DoctorAppointment />}
                  />
                </Routes>
              </AppLayout>
            }
          />
        ) : (
          <Route path="*" element={<DoctorLogin />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
