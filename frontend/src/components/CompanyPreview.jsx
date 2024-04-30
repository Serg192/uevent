import React, { useState, useEffect } from "react";
import { Typography, Box, Stack, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useLoadScript, usePlacesAutocomplete } from "@react-google-maps/api";
import { setKey, fromLatLng, setLocationType } from "react-geocode";

setKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
setLocationType("ROOFTOP");

const libraries = ["places"];

const CompanyPreview = ({ companyData }) => {
  const { _id, name, email, logo, location } = companyData;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [address, setAddress] = useState("");

  useEffect(() => {
    fromLatLng(location.coordinates[0], location.coordinates[1])
      .then(({ results }) => {
        console.log(results[0]?.formatted_address);
        setAddress(results[0]?.formatted_address);
      })
      .catch(console.error);
  }, [location]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: "60%",

        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      <Link to={`/companies/${_id}`}>
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
              logo ||
              "https://www.market-research-companies.in//images/default.jpg"
            }
          />

          <Stack direction="column" spacing={1}>
            <Typography variant="h4">{name}</Typography>
            <Typography variant="h5">Email: {email}</Typography>
            <Typography variant="body1">Address: {address}</Typography>
          </Stack>
        </Stack>
      </Link>
    </Paper>
  );
};

export default CompanyPreview;
