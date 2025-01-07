import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets.js";
import { AdminContext } from "../../context/AdminContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const { backendUrl, cookie } = useContext(AdminContext);

  const [showPassword, setShowPassword] = useState(false);

  const [doctorImage, setDoctorImage] = useState(null);
  const [docName, setDocName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [education, setEducation] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");
  const [availability, setAvailability] = useState("Available");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!doctorImage) {
      toast.error("Image not Selected");
      return;
    }

    const resetForm = () => {
      setDoctorImage(null);
      setDocName("");
      setDocEmail("");
      setPassword("");
      setExperience("1 Year");
      setFees("");
      setSpeciality("General Physician");
      setEducation("");
      setAddress1("");
      setAddress2("");
      setAbout("");
      setAvailability("Available");
    };

    const formData = new FormData();

    formData.append("profile_image", doctorImage);
    formData.append("fullName", docName);
    formData.append("email", docEmail);
    formData.append("password", password);
    formData.append("speciality", speciality);
    formData.append("degree", education);
    formData.append("experience", experience);
    formData.append("about", about);
    formData.append("fees", fees);
    formData.append(
      "address",
      JSON.stringify({ line1: address1, line2: address2 })
    );
    formData.append("availability", availability);

    formData.forEach((value, key) => {
      console.log(`${key}:${value}`);
    });

    try {
      const data = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      console.log(data.data.success);

      if (data.data.success) {
        toast.success(data.data.message);
        resetForm();
      } else {
        toast.error(data.data.message);
        resetForm();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    console.log(cookie);
    console.log(doctorImage);
  }, [cookie, doctorImage]);

  return (
    <form
      onSubmit={(event) => onSubmitHandler(event)}
      className="w-full px-4 py-5">
      <p className="mb-5 text-lg font-medium text-center md:text-left">
        ADD DOCTOR
      </p>
      <div className="bg-white px-8 py-8 border rounded-lg  w-full max-w-5xl  max-h-[80vh] overflow-y-scroll  shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doctor-image" className="flex flex-col items-center">
            <img
              className="w-16 h-16 rounded-full bg-gray-100 cursor-pointer"
              src={
                doctorImage
                  ? URL.createObjectURL(doctorImage)
                  : assets.upload_area
              }
              alt="upload-area"
            />
            <p className="mt-2 text-sm text-gray-600 text-center">
              Upload Doctor Image
            </p>
          </label>
          <input
            onChange={(e) => setDoctorImage(e.target.files[0])}
            type="file"
            id="doctor-image"
            hidden
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-40 gap-6 text-gray-600">
          {/* Left Column */}
          <div className="flex flex-col lg:flex-1 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="doctor-name" className="font-medium">
                Doctor Name:
              </label>
              <input
                onChange={(e) => setDocName(e.target.value)}
                value={docName}
                id="doctor-name"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Enter Doctor Name"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="doctor-email" className="font-medium">
                Doctor Email:
              </label>
              <input
                onChange={(e) => setDocEmail(e.target.value)}
                value={docEmail}
                id="doctor-email"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="email"
                placeholder="Enter Doctor Email"
                required
              />
            </div>
            <div className="relative flex flex-col gap-1">
              <label htmlFor="doctor-password" className="font-medium">
                Doctor Password:
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                id="doctor-password"
                className=" border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Doctor Password"
                autoComplete="off"
                required
              />
              {password && (
                <button
                  onClick={togglePasswordVisibility}
                  type="button"
                  className="absolute  inset-y-[48px] right-1 flex items-center text-gray-500 hover:text-blue-500">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="experience" className="font-medium">
                Experience:
              </label>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                id="experience"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={`${i + 1} Year`}>{`${
                    i + 1
                  } Year`}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="fees" className="font-medium">
                Fees:
              </label>
              <input
                onChange={(e) => setFees(e.target.value)}
                id="fees"
                value={fees}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="number"
                placeholder="Enter Doctor Fees"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col lg:flex-1 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="speciality" className="font-medium">
                Speciality:
              </label>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                id="speciality"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {[
                  "General Physician",
                  "Gynecologist",
                  "Dermatologist",
                  "Pediatricians",
                  "Neurologist",
                  "Gastroenterologist",
                ].map((speciality) => (
                  <option key={speciality} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="education" className="font-medium">
                Education:
              </label>
              <input
                onChange={(e) => setEducation(e.target.value)}
                value={education}
                id="education"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Enter Doctor Education"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="education" className="font-medium">
                Availability:
              </label>
              <select
                onChange={(e) => setAvailability(e.target.value)}
                value={availability}
                id="availability"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {["Available", "Unavailable", "On Leave"].map(
                  (availability) => (
                    <option key={availability} value={availability}>
                      {availability}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="address-line-1" className="font-medium">
                Address:
              </label>
              <input
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                id="address-line-1"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Enter Address Line 1"
                required
              />
              <input
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                id="address-line-2"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3"
                type="text"
                placeholder="Enter Address Line 2"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1">
          <label htmlFor="about-doctor" className="font-medium">
            About Doctor:
          </label>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            id="about-doctor"
            className="border rounded px-4 pt-2 sm:w-[300px]  focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            placeholder="Write About Doctor"
            rows={5}
            required></textarea>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors">
          Add Doctor
        </button>
      </div>
    </form>
  );
};
export default AddDoctor;
