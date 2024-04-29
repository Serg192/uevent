import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Typography,
  Stack,
  Button,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";

const navbarButtons = [
  { type: "tab", name: "Events", link: "/events" },
  { type: "tab", name: "Companies", link: "/companies" },
];

const Navbar = () => {
  const [tab, setTab] = useState(0);
  const currentUser = useSelector(selectCurrentUser);

  const [logoutFromUevent] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("Current user", currentUser);

  const handleLogout = async () => {
    try {
      await logoutFromUevent().unwrap();
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: { md: "space-between" },
          flexDirection: { sm: "row" },
        }}
      >
        <Typography
          variant="h4"
          fontWeight={"bold"}
          sx={{
            whiteSpace: "nowrap",
            display: { sm: "block" },
            marginRight: "25px",
          }}
        >
          UEVENT
        </Typography>
        <Tabs
          textColor="inherit"
          sx={{ marginRight: "auto" }}
          value={tab}
          onChange={(e, val) => {
            setTab(val);
          }}
          indicatorColor="secondary"
        >
          {navbarButtons.map(
            (tab) =>
              tab.type === "tab" && (
                <Tab
                  key={tab.name}
                  label={tab.name}
                  component={Link}
                  to={`${tab.link}`}
                  sx={{ fontSize: "1.0rem" }}
                />
              )
          )}
        </Tabs>
        <Stack direction="row" spacing={2}>
          {currentUser && (
            <Button
              onClick={() => handleLogout()}
              color="warning"
              variant="contained"
            >
              Log out
            </Button>
          )}
          {!currentUser && (
            <>
              <Button
                onClick={() => {
                  setTab(null);
                  navigate("/signup");
                }}
                color="info"
                variant="contained"
              >
                signup
              </Button>
              <Button
                onClick={() => {
                  setTab(null);
                  navigate("/login");
                }}
                color="info"
                variant="contained"
              >
                login
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
