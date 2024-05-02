import React from "react";
import { Typography, Box, Stack, Paper, Chip } from "@mui/material";
import { Link } from "react-router-dom";

const EventPreview = ({ eventData }) => {
  console.log(eventData)
  const { 
    _id, 
    name, 
    description, 
    date, 
    eventPicture, 
    address, 
    company, 
    ticketsAvailable,
    price,
    format,
    themes
  } = eventData;

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
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: { md: "90%", sm: "100%" },
        height: "550px",
        maxHeight: "550px",
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease",

        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      <Link to={`/events/${_id}`}>
        <Stack direction="column" spacing={2}>
          <Box
            component="img"
            sx={{
              height: "auto",
              width: "100%",
              maxWidth: "100%",
              maxHeight: "150px",
              objectFit: "cover", // Зберігає формат зображення
            }}
            alt="The house from the offer."
            src={
              eventPicture ||
              "https://www.market-research-companies.in//images/default.jpg"
            }
          />

          <Stack direction="column" spacing={2}>
            <Typography variant="h3">{name}</Typography>
            <Typography variant="body1">
              <strong>By:</strong> {company.name}
            </Typography>
            <Typography variant="h5">
              <strong>Description:</strong>{" "}
              {description.length > 100
                ? `${description.slice(0, 100)}...`
                : description}
            </Typography>
            <Typography variant="h6">
              <strong>Address:</strong> {address}
            </Typography>
            <Typography variant="h6">
              <strong>Date:</strong>{" "}
              {new Date(date).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </Typography>
            <Typography variant="h6">
              <strong>Tickets left:</strong> {ticketsAvailable}
            </Typography>
            <Typography variant="h6">
              <strong>Price:</strong> {price === 0 ? "Free" : price + "$"}
            </Typography>
            <Stack direction="row" spacing={1}>
              {createChip(format)}
              {createChip(themes[0])}
            </Stack>
          </Stack>
        </Stack>
      </Link>
    </Paper>
  );
};

export default EventPreview;
