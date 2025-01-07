import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctor = ({ speciality, doctorId }) => {
  const { doctors, getAllDoctor } = useContext(AppContext);
  const navigate = useNavigate();

  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    getAllDoctor();
  }, []);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorRelatedData = doctors.filter((item) => {
        return item.speciality == speciality && item._id !== doctorId;
      });
      console.log(doctorRelatedData);
      setRelDoc(doctorRelatedData);
    }
  }, [doctorId, doctors, speciality]);
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 ">
      <h1 className="text-3xl font-medium">Top Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm ">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 px-3 sm:px-0 gap-y-6">
        {relDoc.slice(0, 5).map((item) => {
          return (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-200"
              key={item._id}>
              <img
                className="bg-blue-50"
                src={item.profile_image}
                alt="doc_image"
              />
              <div className="p-4">
                <div
                  className={`flex gap-2 ${
                    item.availability == "Unavailable" ||
                    item.availability == "On Leave"
                      ? "text-red-500"
                      : "text-green-500"
                  } items-center text-sm text-center`}>
                  <p
                    className={`w-2 h-2 rounded-full ${
                      item.availability == "Unavailable" ||
                      item.availability == "On Leave"
                        ? "bg-red-500"
                        : " bg-green-500"
                    }`}></p>
                  <p>{item.availability}</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">
                  {item.fullName.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">
                  {item.speciality.toUpperCase()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-100 px-12 py-3 mt-10 text-gray-600 rounded-full ">
        More
      </button>
    </div>
  );
};

export default RelatedDoctor;
