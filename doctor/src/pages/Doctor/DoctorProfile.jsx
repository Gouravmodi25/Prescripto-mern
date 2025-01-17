import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { cookie, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);

  const [isEdit, setIsEdit] = useState(false);

  const updatedProfile = async () => {
    try {
      const data = await axios.patch(
        `${backendUrl}/api/doctor/update-profile-doctor`,
        {
          address: profileData.address,
          fees: profileData.fees,
          availability: profileData.availability,
        },
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      if (data.data.success) {
        toast.success(data.data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    if (cookie) {
      getProfileData();
    }
  }, [cookie]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col m-5 gap-4">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={profileData.profile_image}
              alt="image"
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* {name,degree,speciality} */}
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.fullName.toUpperCase()}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree}-{profileData.speciality.toUpperCase()}
              </p>
              <button className="py-0.5 px-2 border text-sm rounded-full bg-primary text-white">
                {profileData.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center mt-3 text-neutral-800 gap-1 text-sm font-medium">
                About:
              </p>
              <p className="mt-1 text-sm text-gray-600 max-w-[700px]">
                {profileData.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Appointment Fees:{" "}
              <span className="text-gray-800">
                ${" "}
                {isEdit ? (
                  <input
                    className="bg-indigo-100"
                    type="number"
                    value={profileData.fees}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            <div className="py-2 gap-2 flex">
              <p>Address:</p>
              <p className="text-sm m-1">
                {isEdit ? (
                  <input
                    className="bg-indigo-100"
                    type="text"
                    value={profileData.address.line1}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    className="bg-indigo-100"
                    type="text"
                    value={[profileData.address.line2]}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              <input
                type="checkbox"
                readOnly
                checked={
                  profileData.availability == "Unavailable" ||
                  profileData.availability == "On Leave"
                    ? false
                    : true
                }
                className=""
              />
              {isEdit ? (
                <select
                  className="bg-indigo-50"
                  id="availability"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      availability: e.target.value,
                    }))
                  }
                  value={profileData.availability}>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="On Leave">On Leave</option>
                </select>
              ) : (
                <p>{profileData.availability}</p>
              )}
            </div>

            {isEdit ? (
              <button
                onClick={() => {
                  setIsEdit(false);
                  updatedProfile();
                }}
                className="px-5 py-2 border rounded-full text-sm border-primary mt-4 hover:bg-primary transition-all duration-200 hover:text-white">
                Saved Information
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-5 py-2 border rounded-full text-sm border-primary mt-4 hover:bg-primary transition-all duration-200 hover:text-white">
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
