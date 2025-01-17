import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";
import RelatedDoctor from "../components/RelatedDoctor.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { doctorId } = useParams();
  const [docInfo, setDocInfo] = useState(null);
  const { doctors, getAllDoctor, currencySymbol, backendUrl, cookie } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [bookedSlots, setBookedSlots] = useState([]);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSLotTime] = useState("");

  const navigate = useNavigate();

  const fetchDocInfo = () => {
    if (doctors && doctors.length > 0) {
      const foundDoc = doctors.find((doc) => doc._id === doctorId);
      setDocInfo(foundDoc || null); // Ensure null if no match
    }
  };

  const getAvailableSlots = () => {
    // Reset the doctor slots
    setDocSlots([]);

    const today = new Date();

    // Determine the starting day based on the current time
    let startDay = 0;
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    // Skip today if the time has passed 10:00 PM
    if (currentHour >= 22 || (currentHour === 21 && currentMinute > 30)) {
      startDay = 1;
    }

    // Generate slots for the next 7 valid days
    for (let i = 0; i < 7; i++) {
      // Calculate the date for the current slot day
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + startDay + i);

      // Set the start time of the current day
      if (i === 0 && startDay === 0) {
        // For today, start from the next available slot
        const currentHour = currentDate.getHours();
        currentDate.setHours(currentHour > 10 ? currentHour + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        // For future days, start from 10:00 AM
        currentDate.setHours(10, 0, 0, 0);
      }

      // Set the end time to 10:00 PM for the current day
      const endTime = new Date(currentDate);
      endTime.setHours(22, 0, 0, 0);

      const timeSlots = [];

      // Generate time slots in 30-minute increments
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({
          date: new Date(currentDate), // Clone the current date
          time: formattedTime,
        });

        // Increment time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // Add the generated time slots to the state
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  // to book appointment

  const bookedAppointment = async function () {
    if (!cookie) {
      toast.warn("Login to Booked Slot");
      return navigate("/login");
    }

    try {
      const date = docSlots[slotIndex][0].date;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      const data = await axios.post(
        `${backendUrl}/api/user/booked-appointment`,
        { doctorId, slotDate, slotTime },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      console.log(data);

      if (data.data.success) {
        toast.success(data.data.message);
        getAllDoctor();
        navigate("/my-appointment");
      } else {
        toast.error(data.data.message);
      }

      console.log(slotDate);
    } catch (error) {
      toast.error(error.response?.data.message);
      console.log(error);
    }
  };

  // get booked slot

  const getBookedSlots = async () => {
    try {
      if (!docSlots.length || !docSlots[slotIndex] || !docSlots[slotIndex][0]) {
        console.log("docSlots or slotIndex is invalid. Skipping fetch.");
        return;
      }
      let date = docSlots[slotIndex][0].date;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      const response = await axios.get(
        `${backendUrl}/api/doctor/get-booked-slot?doctorId=${doctorId}&date=${slotDate}`
      );

      console.log(response);
      if (response.data.success) {
        const { date, slots } = response.data.data;
        setBookedSlots((prev) => ({ ...prev, [date]: slots }));
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, doctorId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      getAllDoctor(); // Fetch the latest doctor data periodically
    }, 400); // Fetch every 10 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    if (docSlots.length && docSlots[slotIndex]?.length) {
      console.log("Fetching booked slots...");
      getBookedSlots();
    }
  }, [docSlots, slotIndex]);

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
              src={docInfo.profile_image}
              alt="doctor-image"
              className="w-full sm:max-w-72 rounded-lg bg-primary"
            />
          </div>
          <div className="  flex-1 border border-gray-400 bg-white p-8 py-7 mx-2 sm:mx-0 mt-[-80px] sm:mt-0 ">
            {/* {doc-name,degree,experience} */}
            <p className="flex items-center text-2xl text-gray-900 gap-2 font-medium">
              {docInfo.fullName.toUpperCase()}{" "}
              <img
                className="w-5"
                src={assets.verified_icon}
                alt="verified-icon"
              />
            </p>
            <div className="flex items-center mt-1 gap-2 text-sm text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality.toUpperCase()}
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
        {/* {Booking Slot} */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll scroll-smooth mt-4">
            {docSlots.length &&
              docSlots.map((item, index) => {
                return (
                  <div
                    onClick={() => setSlotIndex(index)}
                    className={`min-w-16 text-center rounded-full cursor-pointer py-6 shadow-sm overflow-hidden ${
                      slotIndex == index
                        ? "bg-primary  text-white"
                        : " border border-gray-200"
                    }`}
                    key={index}>
                    <p>{item[0] && daysOfWeek[item[0].date.getDay()]}</p>
                    <p>{item[0] && item[0].date.getDate()}</p>
                  </div>
                );
              })}
          </div>
          <div className="flex items-center gap-3 mt-4 w-full overflow-x-auto scroll-smooth">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => {
                let date = `${item.date.getDate()}_${
                  item.date.getMonth() + 1
                }_${item.date.getFullYear()}`;

                const isBooked =
                  bookedSlots[date] && bookedSlots[date].includes(item.time);
                // console.log(isBooked);
                return (
                  <p
                    onClick={() => !isBooked && setSLotTime(item.time)} // Only allow clicking on available slots
                    className={`shadow-sm text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer 
            ${
              isBooked
                ? "bg-red-400 text-white cursor-not-allowed"
                : item.time == slotTime
                ? "bg-primary text-white"
                : "text-gray-700 border border-gray-300"
            }`}
                    key={index}>
                    {item.time.toLowerCase()}
                  </p>
                );
              })}
          </div>
          {docInfo.availability == "Available" ? (
            <button
              onClick={bookedAppointment}
              className="cursor-pointer px-14 py-3 text-white bg-primary rounded-full my-6">
              Book an appointment
            </button>
          ) : (
            <button className="cursor-not-allowed px-14 py-3 text-white bg-red-500 rounded-full my-6">
              Not available
            </button>
          )}
        </div>
        {/* {related doctor} */}
        <RelatedDoctor doctorId={doctorId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
