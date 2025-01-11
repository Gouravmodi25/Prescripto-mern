import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const { userData, setUserData, cookie, backendUrl, loadUserData } =
    useContext(AppContext);
  const [image, setImage] = useState(false);
  const [date_of_birth, setDate_of_birth] = useState(userData.data_of_birth);
  const [isEdit, setIsEdit] = useState(false);
  console.log(userData);

  useEffect(() => {
    console.log(userData);
  }, []);

  const updateUserDetails = async function () {
    try {
      const formData = new FormData();

      formData.append("fullName", userData.fullName);
      formData.append("gender", userData.gender);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("phone", userData.phone);
      formData.append("date_of_birth", date_of_birth);

      if (image) {
        formData.append("profile_image", image); // This is how the image file will be sent
      } else {
        formData.append("profile_image", userData.profile_image); // Send the existing image if no new one
      }

      console.log(formData.profile_image);

      const data = await axios.patch(
        `${backendUrl}/api/user/user-update-details`,
        formData,
        {
          headers: {
            Authorization: cookie,
          },
        }
      );

      console.log(data);

      if (data.data.success) {
        toast.success(data.data.message);
        await loadUserData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };

  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm">
        {isEdit ? (
          <label htmlFor="profile_image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded opacity-75"
                src={
                  image ? URL.createObjectURL(image) : userData.profile_image
                }
                alt="profile_image"
              />
              <img
                className="w-10 absolute bottom-12 right-12 "
                src={image ? "" : assets.upload_icon}
                alt=""
              />
            </div>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              id="profile_image"
              hidden
            />
          </label>
        ) : (
          <img
            className="w-36 rounded-lg"
            src={userData.profile_image}
            alt="user-image"
          />
        )}
        {isEdit ? (
          <input
            className="bg-gray-50 mt-4 font-medium max-w-60 text-3xl"
            type="text"
            value={userData.fullName}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
        ) : (
          <p className="text-3xl font-medium mt-4 text-neutral-800 ">
            {userData.fullName.toUpperCase()}
          </p>
        )}

        <hr className="border-none bg-zinc-400 h-[1px]" />

        <div>
          <p className="text-neutral-500 underline mt-4">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] mt-3 gap-y-2.5 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-blue-500">{userData.email}</p>
            <p className="font-medium ">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52 "
                type="email"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-400 ">{userData.phone}</p>
            )}
            <p className="font-medium">Address:</p>
            {isEdit ? (
              <p className="">
                <input
                  className="bg-gray-100 "
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <br />
                <input
                  className="bg-gray-100"
                  type="text"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </p>
            ) : (
              <p className="text-gray-500">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-neutral-500 underline mt-4">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="max-w-20 bg-gray-100"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                value={userData.gender}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Not selected">Not selected</option>
              </select>
            ) : (
              <p className="text-gray-400">{userData.gender}</p>
            )}
            <p className="font-medium">Date of Birth:</p>

            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                type="date"
                value={date_of_birth}
                onChange={(e) => setDate_of_birth(e.target.value)}
              />
            ) : (
              <p className="text-gray-400">{userData.date_of_birth}</p>
            )}
          </div>
        </div>
        <div className="mt-10">
          {isEdit ? (
            <button
              className="border border-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              onClick={updateUserDetails}>
              Save Information
            </button>
          ) : (
            <button
              className="border border-primary px-8 py-3 rounded-full  hover:bg-primary hover:text-white transition-all duration-300"
              onClick={() => setIsEdit(true)}>
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
