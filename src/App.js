import { Container, Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import PhoneVerification from "./components/PhoneVerification";
import { AuthContextProvider } from "./context/AuthContext";
import { DataContextProvider } from "./context/DataContext";

const steps = ["Register courses", "Phone number verification"];

function App() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <AuthContextProvider>
      <DataContextProvider>
        <Container
          sx={{
            p: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            "& form": {
              width: { md: "85%", xs: "95%" },
              border: "1px solid #e0e0e0",
              boxShadow: "0px 0px 25px 10px rgba(0,0,0,0.05)",
              borderRadius: "10px",
              m: 3,
              p: 3,
            },
            "& .MuiTextField-root": {
              m: 1,
              width: "100%",
            },
            "& fieldset": {
              m: 1,
              border: "1px solid #c0c0c0",
              padding: "5px 20px",
              borderRadius: "7px",
            },
            "& .MuiFormGroup-root": {
              display: "flex",
              justifyContent: "space-between",
            },
          }}
        >
          <h1>Next Level Technology - Task</h1>

          <Stepper
            activeStep={activeStep}
            sx={{
              width: { md: "80%", xs: "95%" },
            }}
          >
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {activeStep === 0 ? (
            <RegistrationForm handleNext={handleNext} />
          ) : (
            <PhoneVerification
              handleNext={handleNext}
              handleReset={handleReset}
            />
          )}
        </Container>
      </DataContextProvider>
    </AuthContextProvider>
  );
}

export default App;
