import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = function (props) {
  const calculateAge = (dob) => {
    let today = new Date();

    let birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const slotDateFormat = (slotDate) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const dateArray = slotDate.split("_");

    return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]} ${
      dateArray[2]
    }`;
  };

  // const value = { calculateAge, slotDateFormat };

  return (
    <AppContext.Provider value={{ calculateAge, slotDateFormat }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
