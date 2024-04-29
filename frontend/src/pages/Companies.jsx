import React, { useState, useEffect } from "react";
import { Stack, Typography, Button, Select, MenuItem } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { EditCompany } from "../components";

const Companies = () => {
  const options = ["All", "Followed", "My companies"];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const navigate = useNavigate();
  const userData = useSelector(selectCurrentUser);

  useEffect(() => {
    console.log(`${selectedOption}`);
  }, [selectedOption]);

  const handleCreate = () => {
    if (!userData) navigate("/login");
  };

  return (
    <Stack
      direction="column"
      width="100%"
      alignItems="center"
      mt="30px"
      mb="30px"
      spacing={2}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ width: "60%" }}
      >
        <Typography variant="h2">Companies</Typography>
        <Select
          value={selectedOption}
          onChange={(event) => setSelectedOption(event.target.value)}
          displayEmpty
          variant="outlined"
          fullWidth
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          onClick={handleCreate}
          startIcon={<AddIcon />}
          sx={{ pl: 5, pr: 5 }}
        >
          Create
        </Button>
      </Stack>
      <EditCompany />
    </Stack>
  );
};

export default Companies;
