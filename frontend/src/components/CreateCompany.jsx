import React, { useState } from "react";
import {
  Stack,
  Button,
  Modal,
  Box,
  TextField,
  Typography,
} from "@mui/material";

import { Autocomplete, useLoadScript } from "@react-google-maps/api";

import { useCreateCompanyMutation } from "../features/company/companyApiSlice";
import { EMAIL_REGEX } from "../const/regex";

const placesLibrary = ["places"];

const CreateCompany = ({ isOpen, setIsOpen }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [searchResult, setSearchResult] = useState("");
  const [placeSelected, setPlaceSelected] = useState(false);

  const [createCompany] = useCreateCompanyMutation();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: placesLibrary,
  });

  function onPlaceChanged() {
    if (searchResult != null) {
      setPlaceSelected(true);
    } else {
      setPlaceSelected(false);
    }
  }

  const onSubmit = async () => {
    setNameError(false);
    setEmailError(false);
    if (name.length <= 4 || name.length >= 100) {
      setNameError(true);
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError(true);
    } else if (!placeSelected) {
      alert("Choose company location");
    } else {
      const place = searchResult.getPlace();
      const lat = place.geometry.location.lat();
      const long = place.geometry.location.lng();
      try {
        await createCompany({
          name,
          email,
          lat,
          long,
        }).unwrap();
        handleCloseModal();
      } catch (err) {
        if (err.status === 409) {
          alert(err.data.message);
        }
        console.log(err);
      }
    }
  };

  const handleCloseModal = () => {
    setName("");
    setEmail("");
    setNameError(false);
    setEmailError(false);
    setSearchResult(null);
    setPlaceSelected(false);
    setIsOpen(false);
  };
  return (
    <Modal open={isOpen}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: "500px",
          overflow: "auto",
        }}
      >
        <Typography variant="h4" align="center">
          Create Company
        </Typography>
        <TextField
          id="name"
          label="Name"
          type="text"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          value={name}
          error={nameError}
          helperText={nameError ? "Nname should not be empty" : ""}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(name.length <= 4 || name.length >= 100);
          }}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          required
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(!EMAIL_REGEX.test(email));
          }}
          error={emailError}
          helperText={emailError ? "Please enter a valid email" : ""}
          sx={{ mt: 2 }}
        />

        {isLoaded && (
          <Autocomplete
            onPlaceChanged={onPlaceChanged}
            onLoad={(autocomplete) => {
              setSearchResult(autocomplete);
            }}
          >
            <input
              type="text"
              placeholder="Search for Tide Information"
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </Autocomplete>
        )}

        <Stack direction="row" justifyContent="center" spacing={5} mt={3}>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              onSubmit();
            }}
            sx={{ width: "50%" }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleCloseModal}
            sx={{ width: "50%" }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateCompany;
