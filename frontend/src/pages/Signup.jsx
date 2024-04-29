import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useSignupMutation } from "../features/auth/authApiSlice";

import { useNavigate, Link as RouterLink } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [signup] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Move to separate file
  const PASSWORD_REGEX =
    /^(?=.*[A-Z])(?=.*[!@#$&%^_+=()\\\[\]{};:<>.,|?\-\/*])(?=.*[0-9])(?=.*[a-z]).{10,}$/m;
  const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleSubmit = async (e) => {
    setPasswordError(false);
    setConfirmPasswordError(false);

    console.log(username.length);
    if (username.length <= 4 || username.length >= 100) {
      setUsernameError(true);
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError(true);
    } else if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(true);
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(true);
    } else {
      try {
        const userData = await signup({ username, email, password }).unwrap();
        console.log("User data", userData);
        dispatch(setCredentials({ ...userData }));
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const content = (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className="form"
      >
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="h4" align="center">
                Register
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                id="username"
                label="Username"
                type="text"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                value={username}
                error={usernameError}
                helperText={usernameError ? "Username should not be empty" : ""}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(
                    username.length <= 4 || username.length >= 100
                  );
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(!EMAIL_REGEX.test(email));
                }}
                error={emailError}
                helperText={emailError ? "Please enter a valid email" : ""}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(!PASSWORD_REGEX.test(password));
                }}
                error={passwordError}
                helperText={
                  passwordError ? "Please enter a valid password" : ""
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={confirmPassword}
                required
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                error={confirmPasswordError}
                helperText={
                  confirmPasswordError ? "Passwords do not match" : ""
                }
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                sx={{ mt: 2 }}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="body1" align="center">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login">
                  Sign in
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );

  return content;
};

export default Signup;
