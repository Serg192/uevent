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
import { setCredentials, setUser } from "../features/auth/authSlice";

import { useLoginMutation } from "../features/auth/authApiSlice";
import { useGetMeMutation } from "../features/user/userApiSlice";

import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();
  const [me] = useGetMeMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...data }));

      const user = await me().unwrap();
      dispatch(setUser({ ...user }));

      setEmail("");
      setPassword("");
      navigate("/events");
    } catch (err) {
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
