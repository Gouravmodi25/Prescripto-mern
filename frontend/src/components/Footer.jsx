import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
        {/* {left section} */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="logo" />
          <p className="w-full md:w-2/3 text-gray-500 leading-6">
            Our doctor appointment platform is a user-friendly and efficient way
            to book appointments with healthcare professionals. Whether you need
            a routine check-up, specialist consultation, or urgent care, our
            website connects you with trusted doctors in your area . Explore
            Doctor with their profiles.
          </p>
        </div>
        {/* {center section} */}
        <div>
          <p className="mb-5 text-xl font-medium">COMPANY</p>
          <ul className="text-gray-600 flex flex-col gap-2">
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        {/* {Right Section} */}
        <div>
          <p className="mb-5 text-xl font-medium">Get In Touch</p>
          <ul className="text-gray-600 flex flex-col gap-2">
            <li>+91-8815349191</li>
            <li>gouravmodi39@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* {copyright text} */}
      <div>
        <hr className="bg-gray-900" />
        <p className="py-5 text-center text-sm">
          Copyright-2024©Prescripto - All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
