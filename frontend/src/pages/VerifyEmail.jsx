import React, { useEffect, useState } from "react";
import { Typography, Button, Paper, Box } from "@mui/material";

import { useVerifyEmailMutation } from "../features/auth/authApiSlice";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [infoMessage, setInfoMessage] = useState();

  const [verifyEmail] = useVerifyEmailMutation();

  const handleVerification = async () => {
    const token = queryParams.get("token");
    try {
      await verifyEmail({ token }).unwrap();
      setInfoMessage("Email was verified");
    } catch (err) {
      setInfoMessage("Verification token is invalid");
      console.log(err);
    }
  };

  useEffect(() => {
    handleVerification();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{ width: "50%", padding: "20px", textAlign: "center" }}
      >
        <Typography variant="h2" gutterBottom>
          Email Verification
        </Typography>
        <Typography variant="h5" mb={2} gutterBottom>
          {infoMessage}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Go to Login Page
        </Button>
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;
