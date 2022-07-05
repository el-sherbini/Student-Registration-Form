import { useContext, createContext, useState } from "react";

const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [registrationData, setRegistrationData] = useState({});
  const [otpResult, setOtpResult] = useState({});

  const handleRegistrationData = (data) => {
    setRegistrationData(data);
  };

  const handleOtpResult = (result) => {
    setOtpResult(result);
  };

  return (
    <DataContext.Provider
      value={{
        registrationData,
        handleRegistrationData,
        otpResult,
        handleOtpResult,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const UserData = () => {
  return useContext(DataContext);
};
