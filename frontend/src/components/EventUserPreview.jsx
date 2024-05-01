import React from "react";
import { Chip, Stack, Typography, Paper, Avatar } from "@mui/material";

const EventUserPreview = ({ user }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        alignItems: "start",
        width: "100%",
        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          alt="Company Logo"
          src={user.profilePicture}
          sx={{ width: 40, height: 40, mb: 2 }}
        />
        <Typography variant="h4">{user.username}</Typography>
      </Stack>
    </Paper>
  );
};

export default EventUserPreview;
