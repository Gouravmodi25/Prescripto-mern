import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Doctor from "./pages/Doctor.jsx";
import Login from "./pages/Login.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import MyAppointment from "./pages/MyAppointment.jsx";
import Appointment from "./pages/Appointment.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%] ">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointment" element={<MyAppointment />} />
        <Route path="/appointment/:doctorId" element={<Appointment />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
