import React from "react";
import { Chip, Stack, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const EventSimplifiedPreview = ({ event }) => {
  const createChip = (text) => {
    return (
      <Chip
        label={text}
        style={{
          backgroundColor: "#9300E6",
          color: "#FFFFFF",
          margin: "4px",
          fontSize: 14,
          fontWeight: "bold",
        }}
      />
    );
  };
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
      <Link to={`/events/${event._id}`}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column">
            <Typography variant="h4">{event.name}</Typography>
            <Typography variant="h6">Date: {event.date}</Typography>
            <Typography variant="body1">
              Location:{" "}
              {event.address.length > 40
                ? event.address.substring(0, 40) + "..."
                : event.address}
            </Typography>
          </Stack>
          <Stack direction="column" alignItems="center">
            <Typography variant="h4">
              Price: {event.price == 0 ? "Free" : `${event.price}$`}
            </Typography>
            <Stack direction="row">
              {createChip(event.format)}
              {createChip(event.themes[0])}
            </Stack>
          </Stack>
        </Stack>
      </Link>
    </Paper>
  );
};

export default EventSimplifiedPreview;
