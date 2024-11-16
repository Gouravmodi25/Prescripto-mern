import { assets } from "../assets/assets.js";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500 ">
        <p>
          CONTACT <span className="text-gray-900 font-semibold">US</span>
        </p>
      </div>
      <div className="my-10 gap-10 flex flex-col justify-center md:flex-row mb-10 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt="contact-image"
        />
        <div className="flex flex-col justify-center items-start gap-6 ">
          <p className="text-lg font-semibold text-gray-600 ">Our OFFICE</p>
          <p className="text-gray-500">
            54709 Williams Station Suite <br /> 350, Indore , INDIA
          </p>
          <p className="text-gray-500">
            Tel:8815341919 <br /> Email:prescripto@gmail.com{" "}
          </p>
          <p className="text-lg font-semibold text-gray-600">
            Careers at PRESCRIPTO
          </p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black text-sm py-4 px-8 hover:bg-black hover:text-white transition-all duration-300">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
