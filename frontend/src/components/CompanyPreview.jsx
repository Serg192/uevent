import React from "react";
import { Typography, Box, Stack, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const CompanyPreview = ({ companyData }) => {
  const { _id, name, email, logo, address } = companyData;

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
