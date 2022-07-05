import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";

import { UserData } from "../context/DataContext";
import { UserAuth } from "../context/AuthContext";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const PhoneVerification = ({ handleNext, handleReset }) => {
  const { registrationData, otpResult, handleOtpResult } = UserData();
  const { setUpRecaptcha } = UserAuth();

  const { register, handleSubmit } = useForm();

  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  const submitForm = async (data) => {
    if (data.otp === "" || data.otp === null) return;
    try {
      await otpResult.confirm(data.otp);
      handleNext();
      handleOpenModal();
      addStudentData(registrationData);
    } catch (err) {
      setError("Verification code is incorrect or expired");
      console.log(err.message);
    }
  };

  const addStudentData = async (data) => {
    const studentsCollectionRef = collection(db, "students");

    await addDoc(studentsCollectionRef, {
      fName: data.fName,
      mName: data.mName,
      lName: data.lName,
      phone: data.phone,
      nationalID: data.nationalID,
      email: data.email,
      address1: data.address1,
      address2: data.address2,
      linkedIn: data.linkedIn,
      twitter: data.twitter,
      facebook: data.facebook,
      courses: data.courses,
    }).then((student) => {
      getStudentCourses();
      data.courses.forEach((course) => {
        const courseDoc = doc(db, "courses", course);
        updateDoc(courseDoc, {
          students: arrayUnion(student.id),
        });
      });
    });
  };

  const getStudentCourses = async () => {
    setCourses([]);
    registrationData.courses.forEach(async (course) => {
      const courseDocRef = doc(db, "courses", course);
      const courseDocSnap = await getDoc(courseDocRef);

      setCourses((prev) => [...prev, courseDocSnap.data().course]);
    });
  };

  const resendOTP = async () => {
    try {
      const response = await setUpRecaptcha(registrationData.phone);
      handleOtpResult(response);
      handleNext();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    handleReset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)} autoComplete="off">
        <TextField
          {...register("otp")}
          label="Verification code"
          variant="standard"
          error={error ? true : false}
          helperText={error ? error : ""}
        />

        <Button type="submit" variant="contained" sx={{ m: 1 }}>
          Verify OTP
        </Button>
        <Button
          variant="text"
          sx={{ m: 1, fontSize: "12px" }}
          onClick={resendOTP}
        >
          Resend activation code
        </Button>
      </form>

      <div id="recaptcha-container" />

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: "50%",
            p: "10px",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle>Registration completed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your registration is completed ({registrationData.fName}) and you’ve
            enrolled in these courses.
            {open &&
              courses.map((course, index) => {
                return (
                  <Typography
                    variant="body1"
                    component="span"
                    key={course}
                    sx={{ display: "block" }}
                  >
                    {index + 1} - {course}
                  </Typography>
                );
              })}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhoneVerification;
