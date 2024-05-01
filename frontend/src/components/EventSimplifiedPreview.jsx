import React, { useEffect, useState } from "react";
import { Chip, Stack, Typography, Paper } from "@mui/material";
import { setKey, fromLatLng, setLocationType } from "react-geocode";

setKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
setLocationType("ROOFTOP");

const EventSimplifiedPreview = ({ event }) => {
  const [address, setAddress] = useState("");
  useEffect(() => {
    fromLatLng(event.location.coordinates[0], event.location.coordinates[1])
      .then(({ results }) => {
        setAddress(results[0]?.formatted_address);
      })
      .catch(console.error);
  }, []);
  console.log(event);

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
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column">
          <Typography variant="h4">{event.name}</Typography>
          <Typography variant="h6">Date: {event.date}</Typography>
          <Typography variant="body1">
            Location:{" "}
            {address?.length > 40 ? address?.substring(0, 40) + "..." : address}
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
    </Paper>
  );
};

export default EventSimplifiedPreview;
