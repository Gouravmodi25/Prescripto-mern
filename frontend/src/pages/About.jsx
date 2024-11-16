import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl font-light text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 gap-12 flex flex-col lg:flex-row">
        <img
          className="w-full max-w-[360px] max-h-[360px]"
          src={assets.about_image}
          alt="about-image"
        />
        <div className="flex flex-col justify-center gap-6 lg:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to Prescripto, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Prescripto, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you are booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>
          <b className="text-gray-800">OUR VISION</b>
          <p>
            Our vision at Prescripto is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>
      <div>
        <p className="text-xl ml-4 font-light">
          WHY <span className="text-gray-800 font-semibold">CHOOSE US</span>
        </p>
      </div>
      <div className="flex flex-col mb-10 md:flex-row mt-8">
        <div className="flex border px-10 md:px-16 py-8 md:py-16 flex-col gap-5 text-[15px] hover:bg-primary hover:text-white text-gray-600 cursor-pointer transition-all duration-300">
          <b>Efficiency:</b>
          <p>
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>
        <div className="flex border px-10 md:px-16 py-8 md:py-16 flex-col gap-5 text-[15px] hover:bg-primary hover:text-white text-gray-600 cursor-pointer transition-all duration-300">
          <b>Convenience:</b>
          <p>
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>
        <div className="flex border px-10 md:px-16 py-8 md:py-16 flex-col gap-5 text-[15px] hover:bg-primary hover:text-white text-gray-600 cursor-pointer transition-all duration-300">
          <b>Personalization:</b>
          <p>
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
