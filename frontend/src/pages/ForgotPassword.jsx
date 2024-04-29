import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";

import { InfoHint } from "../components";
import { useNavigate } from "react-router-dom";

import { useResetPasswordMutation } from "../features/auth/authApiSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleSubmit = async () => {
    if (!EMAIL_REGEX.test(email)) {
      setEmailError(true);
    } else {
      try {
        await resetPassword({ email }).unwrap();
        setShowInfo(true);
        setEmail("");
        setEmailError(true);
        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Forgot Your Password?
        </Typography>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(!EMAIL_REGEX.test(email));
          }}
          error={emailError}
          helperText={emailError ? "Please enter a valid email" : ""}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Send Reset Password Email
        </Button>
      </Paper>

      {showInfo && (
        <InfoHint
          text={"Check your email to reset your password"}
          onClose={() => setShowInfo(false)}
        />
      )}
    </Box>
  );
};

export default ForgotPassword;
