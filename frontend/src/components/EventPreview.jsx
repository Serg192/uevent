import React from "react";
import { Typography, Box, Stack, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const EventPreview = ({ eventData }) => {
  const { _id, name, description, date, eventPicture, address } = eventData;
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: { md: "60%", sm: "100%" },

        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      <Link to={`/events/${_id}`}>
        <Stack direction="row" spacing={2}>
          <Box
            component="img"
            sx={{
              height: 233,
              width: 350,
              maxHeight: 100,
              maxWidth: 100,
            }}
            alt="The house from the offer."
            src={
              eventPicture ||
              "https://www.market-research-companies.in//images/default.jpg"
            }
          />

          <Stack direction="column" spacing={1}>
            <Typography variant="h4">{name}</Typography>
            <Typography variant="h5">Description: {description}</Typography>
            <Typography variant="body1">Address: {address}</Typography>
            <Typography variant="body1">
              Date:{" "}
              {new Date(date).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </Typography>
          </Stack>
        </Stack>
      </Link>
    </Paper>
  );
};

export default EventPreview;
