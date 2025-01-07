import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorList = () => {
  const { doctors, cookie, getAllDoctor } = useContext(AdminContext);

  useEffect(() => {
    console.log(cookie);
    if (cookie) {
      getAllDoctor();
    } // Fetch doctors on component mount
  }, []);

  useEffect(() => {
    console.log(doctors);
  }, [doctors]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll ">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            className=" transition-all duration-500 border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
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
                <p
                  className={`${
                    item.availability === "Unavailable" ||
                    item.availability === "On Leave"
                      ? "text-red-500"
                      : "text-green-500"
                  } font-medium`}>
                  {item.availability}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
