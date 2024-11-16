import { useState } from "react";
import { assets } from "../assets/assets.js";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Gourav Modi",
    image: assets.profile_pic,
    email: "gouravmodi39@gmail.com",
    phone: "+91-8815349191",
    address: {
      line1: "140,Shubham Nagar",
      line2: "near Sangam Nagar,Indore",
    },
    gender: "Male",
    birthDate: "2005-09-25",
  });

  const [isEdit, setIsEdit] = useState(true);
  console.log(userData);

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <img className="w-36 rounded-lg" src={userData.image} alt="user-image" />
      {isEdit ? (
        <input
          className="bg-gray-50 mt-4 font-medium max-w-60 text-3xl"
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="text-3xl font-medium mt-4 text-neutral-800 ">
          {userData.name}
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
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}
          <p className="font-medium">Date of Birth:</p>

          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              value={userData.birthDate}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, birthDate: e.target.value }))
              }
            />
          ) : (
            <p className="text-gray-400">{userData.birthDate}</p>
          )}
        </div>
      </div>
      <div className="mt-10">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
            onClick={() => setIsEdit(false)}>
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
  );
};

export default MyProfile;
