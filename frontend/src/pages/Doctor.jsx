import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctor = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { doctors, getAllDoctor } = useContext(AppContext);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality == speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    getAllDoctor();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`px-3 py-1 border rounded-lg transition-all text-sm sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}>
          Filters
        </button>
        <div
          className={`flex flex-col text-gray-600 text-sm gap-4 transition-all duration-300 ${
            showFilter ? "flex" : "sm:flex hidden"
          }`}>
          <p
            onClick={() =>
              speciality === "general physician"
                ? navigate("/doctors")
                : navigate("/doctors/general physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all duration-300 cursor-pointer ${
              speciality == "general physician" ? "bg-indigo-100" : ""
            }`}>
            GENERAL PHYSICIAN
          </p>
          <p
            onClick={() =>
              speciality === "gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality == "gynecologist" ? "bg-indigo-100" : ""
            }`}>
            GYNECOLOGIST
          </p>
          <p
            onClick={() =>
              speciality === "dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality == "dermatologist" ? "bg-indigo-100" : ""
            }`}>
            DERMATOLOGIST
          </p>
          <p
            onClick={() =>
              speciality === "pediatricians"
                ? navigate("/doctors")
                : navigate("/doctors/pediatricians")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality == "pediatricians" ? "bg-indigo-100" : ""
            }`}>
            PEDIATRICIAN
          </p>
          <p
            onClick={() =>
              speciality === "neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality == "neurologist" ? "bg-indigo-100" : ""
            }`}>
            NEUROLOGIST
          </p>
          <p
            onClick={() =>
              speciality === "gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality == "gastroenterologist" ? "bg-indigo-100" : ""
            }`}>
            GASTROENTEROLOGY
          </p>
        </div>
        <div className="w-full grid gap-4 gap-y-6 grid-cols-auto">
          {filterDoc.map((item) => {
            return (
              <div
                onClick={() => navigate(`/appointment/${item._id}`)}
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
      </div>
    </div>
  );
};

export default Doctor;
