import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { InfoHint } from "../components";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";

import { useVerifyPasswordResetMutation } from "../features/auth/authApiSlice";

const VerifyPasswordReset = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const navigate = useNavigate();

  const [confirmReset] = useVerifyPasswordResetMutation();

  const PASSWORD_REGEX =
    /^(?=.*[A-Z])(?=.*[!@#$&%^_+=()\\\[\]{};:<>.,|?\-\/*])(?=.*[0-9])(?=.*[a-z]).{10,}$/m;

  const handleSubmit = async () => {
    const token = queryParams.get("token");
    setPasswordError(false);
    setConfirmPasswordError(false);

    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(true);
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(true);
    } else {
      try {
        await confirmReset({ token, password }).unwrap();
        setShowInfo(true);
        setPassword("");
        setConfirmPassword("");
      } catch (err) {
        navigate("/login");
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
          Reset Your Password
        </Typography>
        <TextField
          fullWidth
          label="New Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(!PASSWORD_REGEX.test(password));
          }}
          error={passwordError}
          helperText={passwordError ? "Please enter a valid password" : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          error={confirmPasswordError}
          helperText={confirmPasswordError ? "Passwords do not match" : ""}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Reset Password
        </Button>
        <Typography mt={2} variant="body1" align="center">
          Back to login{" "}
          <Link component={RouterLink} to="/login">
            Click here
          </Link>
        </Typography>
      </Paper>
      {showInfo && (
        <InfoHint
          text="Your password has been reset successfully"
          onClose={() => setShowInfo(false)}
        />
      )}
    </Box>
  );
};

export default VerifyPasswordReset;
