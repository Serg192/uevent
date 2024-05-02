import React, { useEffect, useState } from "react";
import {
  Stack,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Switch,
  Select,
  MenuItem,
  Divider,
  Avatar,
} from "@mui/material";
import * as dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { Autocomplete, useLoadScript } from "@react-google-maps/api";

import { useCreateEventMutation } from "../features/company/companyApiSlice";
import {
  useUpdateEventMutation,
  useUploadBannerMutation,
} from "../features/event/eventApiSlice";

const EditEvent = ({ isOpen, setIsOpen, companyId, initData, initAddress }) => {
  const format = ["conference", "lecture", "workshop", "fest"];
  const themes = ["business", "politics", "psychology", "IT"];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState();
  const [tickets, setTickets] = useState();
  const [address, setAddress] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState();
  const [selectedTheme, setSelectedTheme] = useState();
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [ticketsError, setTicketsError] = useState(false);
  const [banner, setBanner] = useState();
  const [file, setFile] = useState();

  const [searchResult, setSearchResult] = useState("");
  const [placeSelected, setPlaceSelected] = useState(false);

  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [uploadBanner] = useUploadBannerMutation();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (initData) {
      setAddress(initAddress);
      setName(initData.name);
      setDescription(initData.description);
      setDate(new Date(initData.date));
      setIsFree(initData.price === 0);
      setTickets(initData.ticketsAvailable);
      setPrice(initData.price);
      setSelectedFormat(initData.format);
      setSelectedTheme(initData.themes[0]);
    } else {
      setDate(new Date());
      setSelectedFormat(format[0]);
      setSelectedTheme(themes[0]);
    }
    setBanner(
      initData?.eventPicture ||
        "https://data.micepad.co/data/contents/6176/micepad-default-banner-new.jpg"
    );
  }, [isOpen]);

  function onPlaceChanged() {
    if (searchResult != null) {
      setPlaceSelected(true);
      const place = searchResult.getPlace();
      setAddress(place.formatted_address);
    } else {
      setPlaceSelected(false);
    }
  }
  const handleUploadImage = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        console.log(formData);
        const data = await uploadBanner({
          id: initData._id,
          formData,
        }).unwrap();
        setBanner(data.url);
      } catch (err) {
        console.error("Error uploading photo:", err);
      }
    }
  };

  const handleSubmit = async () => {
    setNameError(false);
    setDescriptionError(false);
    setPriceError(false);
    setTicketsError(false);
    if (name.length <= 4 || name.length >= 100) {
      setNameError(true);
    } else if (description.length < 16 || description.length >= 500) {
      setDescriptionError(true);
    } else if ((!isFree && price <= 0) || (!isFree && !price)) {
      setPriceError(true);
    } else if (!tickets || tickets <= 0) {
      setTicketsError(true);
    } else if (!address || !searchResult) {
      alert("Choose location");
    } else {
      const place = searchResult.getPlace();
      const lat = place?.geometry.location.lat();
      const long = place?.geometry.location.lng();

      try {
        if (initData) {
          await updateEvent({
            id: initData._id,
            data: {
              name,
              description,
              date,
              price: isFree ? 0 : price,
              ticketsAvailable: tickets,
              lat: lat || initData.location.coordinates[0],
              long: long || initData.location.coordinates[1],
              format: selectedFormat,
              themes: [selectedTheme],
              address,
            },
          }).unwrap();
        } else {
          await createEvent({
            id: companyId,
            data: {
              name,
              description,
              date,
              price: isFree ? 0 : price,
              ticketsAvailable: tickets,
              lat,
              long,
              format: selectedFormat,
              themes: [selectedTheme],
              address,
            },
          }).unwrap();
        }
        handleCloseModal();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCloseModal = () => {
    setName("");
    setDescription("");
    setDescriptionError(false);
    setNameError(false);
    setAddress("");
    setTickets(null);
    setPrice(null);
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
          maxHeight: "100vh",
          overflowY: "auto",
          p: 4,
          minWidth: "700px",
          overflow: "auto",
        }}
      >
        <Typography variant="h3" align="center">
          {initData ? "Edit event" : "Create event"}
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
              <Box
                component="img"
                sx={{
                  height: 75,
                  width: 100,
                }}
                alt="The house from the offer."
                src={banner}
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
                  onClick={() => handleUploadImage()}
                >
                  Upload
                </Button>
              </Stack>
            </Stack>
            <Divider
              orientation="horizontal"
              sx={{ mt: 1, mb: 1, backgroundColor: "gray" }}
              flexItem
            />
          </>
        )}

        <Stack direction="row" spacing={3} justifyContent="space-between">
          <Stack direction="column" width="50%" spacing={3}>
            <Box>
              <Typography variant="h5" mt={2}>
                General information
              </Typography>
              <Divider
                orientation="horizontal"
                sx={{ mt: 1, mb: 1, backgroundColor: "gray" }}
                flexItem
              />
            </Box>
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
              id="description"
              label="Description"
              type="text"
              placeholder="Description"
              required
              fullWidth
              multiline
              rows={9}
              value={description}
              error={descriptionError}
              helperText={
                descriptionError ? "Description should not be empty" : ""
              }
              onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionError(
                  e.target.value.length <= 16 || e.target.value.length >= 500
                );
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start At"
                value={dayjs(date)}
                onChange={(newValue) => setDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Stack>
          <Stack direction="column" width="50%" spacing={3}>
            <Box>
              <Typography variant="h5" mt={2}>
                Tickets
              </Typography>
              <Divider
                orientation="horizontal"
                sx={{ mt: 1, mb: 1, backgroundColor: "gray" }}
                flexItem
              />
            </Box>

            <Stack direction="row">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5">Free:</Typography>
                <Switch
                  checked={isFree}
                  onChange={() => {
                    setIsFree((prev) => !prev);
                    setPriceError(false);
                  }}
                  color="primary"
                />
              </Stack>
              <TextField
                id="price"
                label="Price (USD)"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={isFree}
                value={price}
                error={priceError}
                helperText={priceError ? "The data should be meaningful" : ""}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  min: "1",
                }}
              />
            </Stack>
            <TextField
              id="tickets"
              label="Tickets"
              type="number"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={tickets}
              error={ticketsError}
              helperText={ticketsError ? "The data should be meaningful" : ""}
              onChange={(e) => {
                setTickets(e.target.value);
                setTicketsError(e.target.value <= 0);
              }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                min: "1",
              }}
            />
            <Box>
              <Typography variant="h5" mt={1}>
                Additional information
              </Typography>
              <Divider
                orientation="horizontal"
                sx={{ mt: 1, backgroundColor: "gray" }}
                flexItem
              />
            </Box>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h5">Format:</Typography>
              <Select
                value={selectedFormat}
                onChange={(event) => setSelectedFormat(event.target.value)}
                variant="outlined"
                fullWidth
              >
                {format.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h5">Theme:</Typography>
              <Select
                value={selectedTheme}
                onChange={(event) => setSelectedTheme(event.target.value)}
                variant="outlined"
                fullWidth
              >
                {themes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>
        </Stack>

        <Box>
          <Typography variant="h5" mt={1}>
            Location
          </Typography>
          <Divider
            orientation="horizontal"
            sx={{ mt: 1, backgroundColor: "gray" }}
            flexItem
          />
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography mt={2} variant="h5">
            Address: {address}
          </Typography>
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
        </Stack>

        <Divider
          orientation="horizontal"
          sx={{ mt: 1, backgroundColor: "gray" }}
          flexItem
        />

        <Stack direction="row" justifyContent="center" spacing={5} mt={3}>
          <Button
            variant="contained"
            color="info"
            sx={{ width: "50%" }}
            onClick={() => handleSubmit()}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => handleCloseModal()}
            sx={{ width: "50%" }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditEvent;
