import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorList = () => {
  const { doctors, cookie, getAllDoctor, backendUrl } =
    useContext(AdminContext);

  const handleChangeAvailability = async function (doctorId, status) {
    try {
      const data = await axios.patch(
        `${backendUrl}/api/admin/change-availability`,
        { doctorId: String(doctorId), status: String(status) },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        toast.success(data.data.message);
        getAllDoctor();
      }
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };

  useEffect(() => {
    if (cookie) {
      getAllDoctor();
      const interval = setInterval(() => {
        getAllDoctor(); // Periodic fetch
      }, 5000); // Fetch every 5 seconds

      return () => clearInterval(interval);
    }
  }, [cookie]);

  useEffect(() => {
    console.log(doctors);
  }, [doctors]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll ">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            className="hover:translate-y-[-10px] transition-all   duration-200 border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            key={index}>
            <img
              className="bg-indigo-100 group-hover:bg-primary transition-all duration-500 "
              src={item.profile_image}
              alt={item.fullName}
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium ">
                {item.fullName.toUpperCase()}
              </p>
              <p className="text-zinc-600 text-xs">
                {item.speciality.toUpperCase()}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  readOnly
                  checked={
                    item.availability == "Unavailable" ||
                    item.availability == "On Leave"
                      ? false
                      : true
                  }
                  className=""
                />
                <select
                  id="availability"
                  onChange={(event) => {
                    handleChangeAvailability(item._id, event.target.value);
                  }}
                  value={item.availability}>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
