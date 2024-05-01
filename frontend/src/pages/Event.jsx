import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import {
  useGetEventMutation,
  useGetSubscribedToEventUsersMutation,
} from "../features/event/eventApiSlice";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  useMediaQuery,
  Box,
  Chip,
  Paper,
  Stack,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { setKey, fromLatLng, setLocationType } from "react-geocode";
import EditIcon from "@mui/icons-material/Edit";

import { EditEvent } from "../components";

const Event = () => {
  const { eid } = useParams();
  const isLargeScreen = useMediaQuery("(min-width:850px)");

  const [eventData, setEventData] = useState(null);
  const [subscribedUsers, setSubscribedUsers] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [visibleToPublic, setVisibleToPublic] = useState(false);

  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);

  const userData = useSelector(selectCurrentUser);

  const [getEvent] = useGetEventMutation();
  const [getUsers] = useGetSubscribedToEventUsersMutation();

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

  const loadUsers = async () => {
    try {
      const response = await getUsers({ id: eid }).unwrap();
      console.log("Loaded users", response);
    } catch (err) {
      console.log(err);
    }
  };

  const loadEventData = async () => {
    try {
      const response = await getEvent({
        id: eid,
        ...(userData && { uid: userData.user._id }),
      }).unwrap();
      setEventData(response.data.event);
      setIsOwner(response.data.event.company.owner === userData?.user._id);
      setSubscribed(response.subscribed);
      if (response.subscribed) {
        setVisibleToPublic(response.visibleToPublic);
      }
      console.log("Event loaded", response);
      await loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadEventData();
  }, [eid, userData, isEditEventModalOpen]);

  return (
    <Box>
      <Paper
        sx={{
          alignItems: "center",
          height: 200,
          backgroundImage: `url(${
            eventData?.eventPicture ||
            "https://data.micepad.co/data/contents/6176/micepad-default-banner-new.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Paper>
      <Stack direction={isLargeScreen ? "row" : "column"} width="100%">
        <Stack direction="column" width={isLargeScreen ? "50%" : "100%"}>
          <Typography variant="h1" pl={2} pt={2}>
            {eventData?.name.toUpperCase()}
          </Typography>
          <Typography variant="h5" pl={2}>
            {eventData &&
              new Date(eventData.date).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
          </Typography>
          <Stack direction="row" pl={2}>
            {createChip(eventData?.format)} {createChip(eventData?.themes[0])}
          </Stack>
          <Typography variant="h5" pl={2} pt={2}>
            {eventData?.address}
          </Typography>
          <GoogleMap
            center={{
              lat: eventData?.location.coordinates[0],
              lng: eventData?.location.coordinates[1],
            }}
            zoom={15}
            mapContainerStyle={{
              width: "100%",
              height: "400px",
              marginTop: "16px",
            }}
          >
            <Marker
              position={{
                lat: eventData?.location.coordinates[0],
                lng: eventData?.location.coordinates[1],
              }}
            />
          </GoogleMap>
        </Stack>
        <Stack direction="column" width={isLargeScreen ? "50%" : "100%"}>
          {isOwner && (
            <Stack direction="row" pt={2} mr={2} justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditEventModalOpen(true)}
              >
                Edit
              </Button>
            </Stack>
          )}
          <Paper sx={{ width: "100%", p: 2, mt: 6 }}>
            <Typography variant="h3" pl={2}>
              Description
            </Typography>
            <Typography variant="h4" pl={2} mt={1}>
              {eventData?.description}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, mt: 1, minHeight: "450px", width: "100%" }}>
            <Typography variant="h5">Users</Typography>
            <Divider
              orientation="horizontal"
              sx={{ mt: 1, backgroundColor: "gray" }}
              flexItem
            />
          </Paper>
        </Stack>
      </Stack>
      <EditEvent
        isOpen={isEditEventModalOpen}
        setIsOpen={setIsEditEventModalOpen}
        companyId={eventData?.company._id}
        initData={eventData}
        initAddress={eventData?.address}
      />
    </Box>
  );
};

export default Event;
