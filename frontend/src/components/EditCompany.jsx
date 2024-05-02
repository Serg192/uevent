import React, { useEffect, useState } from "react";
import {
  Stack,
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";

import { Autocomplete, useLoadScript } from "@react-google-maps/api";

import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useUploadCompanyLogoMutation,
} from "../features/company/companyApiSlice";
import { EMAIL_REGEX } from "../const/regex";

const placesLibrary = ["places"];

const CreateCompany = ({ isOpen, setIsOpen, initData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(null);
  const [logo, setLogo] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [file, setFile] = useState();
  const [searchResult, setSearchResult] = useState("");
  const [placeSelected, setPlaceSelected] = useState(false);

  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [uploadCompanyLogo] = useUploadCompanyLogoMutation();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: placesLibrary,
  });

  function onPlaceChanged() {
    if (searchResult != null) {
      setPlaceSelected(true);
      const place = searchResult.getPlace();
      setAddress(place.formatted_address);
    } else {
      setPlaceSelected(false);
    }
  }

  const handleImageUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        console.log(formData);
        const data = await uploadCompanyLogo({
          id: initData._id,
          formData,
        }).unwrap();
        setLogo(data.url);
      } catch (err) {
        console.error("Error uploading photo:", err);
      }
    }
  };

  useEffect(() => {
    if (initData) {
      setName(initData.name);
      setEmail(initData.email);
      setLogo(initData.logo);
      setAddress(initData.address);
      console.log("EDIT COMPANY", initData);
    }
  }, [isOpen]);

  const onSubmit = async () => {
    setNameError(false);
    setEmailError(false);
    if (name.length <= 4 || name.length >= 100) {
      setNameError(true);
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError(true);
    } else if (!placeSelected && !initData) {
      alert("Choose company location");
    } else {
      const place = searchResult.getPlace();
      const lat = place?.geometry.location.lat();
      const long = place?.geometry.location.lng();
      try {
        if (initData) {
          //EditMode
          await updateCompany({
            id: initData._id,
            data: {
              name,
              email,
              lat: lat || initData.location.coordinates[0],
              long: long || initData.location.coordinates[1],
              address,
            },
          }).unwrap();
        } else {
          await createCompany({
            name,
            email,
            lat,
            long,
            address,
          }).unwrap();
        }

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
    setAddress("");
    setNameError(false);
    setEmailError(false);
    setSearchResult(null);
    setPlaceSelected(false);
    setIsOpen(false);
    setFile(null);
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
          {(initData ? "Edit " : "Create") + "Company"}
        </Typography>

        {initData && (
          <>
            <Stack
              direction="row"
              mt={2}
              mb={2}
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                alt="Company Logo"
                src={logo}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Stack direction="column">
                <input
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  sx={{ mt: 2 }}
                  onClick={() => handleImageUpload()}
                >
                  Upload
                </Button>
              </Stack>
            </Stack>
            <Divider
              orientation="horizontal"
              sx={{ mt: 3, mb: 3, backgroundColor: "gray" }}
              flexItem
            />
          </>
        )}

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

        {address && (
          <>
            <Divider
              orientation="horizontal"
              sx={{ mt: 3, backgroundColor: "gray" }}
              flexItem
            />
            <Typography mt={2} variant="h5">
              Address: {address}
            </Typography>
          </>
        )}
        {isLoaded && (
          <Autocomplete
            onPlaceChanged={onPlaceChanged}
            onLoad={(autocomplete) => {
              setSearchResult(autocomplete);
            }}
          >
            <input
              type="text"
              placeholder="Start input new Address"
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
