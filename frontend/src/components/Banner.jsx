import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="flex rounded-lg bg-primary px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 ">
      {/* {Left side} */}
      <div className="flex-1 py-8  sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-white font-semibold">
          <p>Book appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
        </div>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="bg-white text-gray-500 rounded-full hover:scale-105 transition-all duration-200 mt-6 text-sm sm:text-base py-3 px-8">
          Create Account
        </button>
      </div>

      {/* {right side} */}
      <div className="hidden md:w-1/2 lg:w-[370px] relative md:block">
        <img
          className="w-full max-w-md absolute right-0 bottom-0"
          src={assets.appointment_img}
          alt="banner-image"
        />
      </div>
    </div>
  );
};

export default Banner;
