import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Link,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { useComfirmUserJoinMutation } from "../features/calendars/calendarsApiSlice";

import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";

// import "../forms.css";

const Login = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();
  const [confirmJoin] = useComfirmUserJoinMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = queryParams.get("token");
    if (token) {
      sessionStorage.setItem("inviteToCalendarToken", token);
    }
    queryParams.delete("token");
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...userData }));
      setEmail("");
      setPassword("");

      const inviteToken = sessionStorage.getItem("inviteToCalendarToken");
      if (inviteToken && inviteToken !== "null") {
        try {
          await confirmJoin({ data: { token: inviteToken } }).unwrap();
        } catch (err) {
          console.log(err);
        }
        sessionStorage.setItem("inviteToCalendarToken", "null");
      }

      navigate("/welcome");
    } catch (err) {
      // handle errors
      console.log(err);
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
                Login
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                Sign In
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="body1" align="center">
                Don't have an account?{" "}
                <Link component={RouterLink} to="/signup">
                  Sign up
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" align="center">
                Forgot password{" "}
                <Link component={RouterLink} to="/forgot-password">
                  Click here
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

export default Login;
