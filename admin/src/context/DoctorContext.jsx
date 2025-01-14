// import { useState } from "react";
import { createContext } from "react";
// import { axios } from 'axios';

export const DoctorContext = createContext();

const DoctorContextProvider = function (props) {
  // get appointment data of doctor

  const value = {};

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
