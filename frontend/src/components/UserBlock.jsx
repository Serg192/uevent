import React from "react";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { Avatar, Button, Stack, Typography } from "@mui/material";

import { useLogoutMutation } from "../features/auth/authApiSlice";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserBlock = () => {
  const appUser = useSelector(selectCurrentUser);
  const initials = appUser?.username[0];

  const [appLogout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    appLogout();
    dispatch(logout);
    navigate("/login");
  };

  return (
    <Stack direction="row" alignItems="center" spacing={5}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          sx={{ bgcolor: "#1979a8", color: "#ffffff", fontWeight: "bold" }}
        >
          {initials}
        </Avatar>
        <Typography fontSize={15} fontWeight="bold">
          {appUser?.username}
        </Typography>
      </Stack>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        logout
      </Button>
    </Stack>
  );
};

export default UserBlock;
