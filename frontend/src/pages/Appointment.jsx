import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";

const Appointment = () => {
  const { doctorId } = useParams();
  const [docInfo, setDocInfo] = useState(null);
  const { doctors, currencySymbol } = useContext(AppContext);

  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSLotTime] = useState("");

  const fetchDocInfo = () => {
    if (doctors && doctors.length > 0) {
      const foundDoc = doctors.find((doc) => doc._id === doctorId);
      setDocInfo(foundDoc || null); // Ensure null if no match
    }
  };

  const getAvailbleSlots = () => {
    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // get date with index

      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of day with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        timeSlots.push({
          date: new Date(currentDate),
          time: formattedTime,
        });

        // increment time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, doctorId]);

  useEffect(() => {
    getAvailbleSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  if (!docInfo) {
    return <p>Loading doctor details...</p>; // Or a better loading state
  }
  return (
    docInfo && (
      <div>
        {/* {DOctor details} */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              src={docInfo.image}
              alt="doctor-image"
              className="w-full sm:max-w-72 rounded-lg bg-primary"
            />
          </div>
          <div className="  flex-1 border border-gray-400 bg-white p-8 py-7 mx-2 sm:mx-0 mt-[-80px] sm:mt-0 ">
            {/* {doc-name,degree,experience} */}
            <p className="flex items-center text-2xl text-gray-900 gap-2 font-medium">
              {docInfo.name}{" "}
              <img
                className="w-5"
                src={assets.verified_icon}
                alt="verified-icon"
              />
            </p>
            <div className="flex items-center mt-1 gap-2 text-sm text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-.5 rounded-full px-2 border text-sm shadow-md">
                {docInfo.experience}
              </button>
            </div>
            <div>
              {/* {about doctor} */}
              <p className="flex items-center mt-3 text-sm text-gray-900 gap-1 ">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm max-w-[700px] mt-1 text-gray-500">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 mt-4 font-medium">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default Appointment;
