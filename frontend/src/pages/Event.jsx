import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import {
  useGetEventMutation,
  useGetSubscribedToEventUsersMutation,
  useToggleVisibleToPublicMutation,
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
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  EditEvent,
  Subscribe,
  PageController,
  EventUserPreview,
  PromoCodes,
} from "../components";

const Event = () => {
  const { eid } = useParams();
  const isLargeScreen = useMediaQuery("(min-width:850px)");
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [subscribedUsers, setSubscribedUsers] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [visibleToPublic, setVisibleToPublic] = useState(false);

  const [paginationInfo, setPaginationInfo] = useState({});
  const [page, setPage] = useState(1);

  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isPromoCodesModalOpen, setIsPromoCodesModalOpen] = useState(false);
  const userData = useSelector(selectCurrentUser);

  const [getEvent] = useGetEventMutation();
  const [getUsers] = useGetSubscribedToEventUsersMutation();
  const [toggleVisibility] = useToggleVisibleToPublicMutation();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

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
      const response = await getUsers({ id: eid, page, pageSize: 10 }).unwrap();
      setSubscribedUsers(response.data.data);
      setPaginationInfo({
        currentPage: response.data.currentPage,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
      console.log("Get users", response.data.data);
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
      setIsOwner(
        userData
          ? response.data.event.company.owner === userData?.user._id
          : false
      );
      setSubscribed(response.data.subscribed);

      console.log("load event data", response);
      if (response.data.subscribed) {
        setVisibleToPublic(response.data.visibleToPublic);
      }

      await loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickSubscribe = async () => {
    if (!userData) {
      navigate("/login");
    } else {
      setIsSubscribeModalOpen(true);
    }
  };

  const handleVisibilityChange = async () => {
    try {
      await toggleVisibility({ id: eid }).unwrap();
      await loadEventData();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadEventData();
  }, [eid, userData, isEditEventModalOpen, isSubscribeModalOpen, page]);

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
          {isLoaded && (
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
          )}
        </Stack>
        <Stack direction="column" width={isLargeScreen ? "50%" : "100%"}>
          <Stack
            direction="row"
            spacing={2}
            pt={2}
            mr={2}
            justifyContent="flex-end"
          >
            {isOwner && (
              <>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditEventModalOpen(true)}
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  onClick={() => setIsPromoCodesModalOpen(true)}
                >
                  Promo codes
                </Button>
              </>
            )}
            {!isOwner && subscribed && (
              <Button
                variant="contained"
                onClick={() => handleVisibilityChange()}
              >
                {visibleToPublic ? "Don't show in list" : "Show in list"}
              </Button>
            )}
            {!isOwner && (
              <Button
                disabled={subscribed}
                variant="contained"
                onClick={() => {
                  if (!subscribed) handleClickSubscribe();
                }}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </Button>
            )}
          </Stack>

          <Paper sx={{ width: "100%", p: 2, mt: 6 }}>
            <Stack direction="row" pl={2} justifyContent="space-between">
              <Typography variant="h4">
                Price:
                {eventData?.price === 0 ? "Free" : eventData?.price + "$"}
              </Typography>
              <Typography variant="h4" mr={1}>
                Tickets:
                {eventData?.ticketsAvailable}
              </Typography>
            </Stack>
            <Divider
              orientation="horizontal"
              sx={{ mt: 1, backgroundColor: "gray" }}
              flexItem
            />
            <Typography variant="h3" pl={2} mt={1}>
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
            <Stack direction="column" alignItems="center">
              {subscribedUsers?.map((uData) => (
                <EventUserPreview user={uData.user} />
              ))}
              {subscribedUsers?.length ? (
                <PageController
                  paginationInfo={paginationInfo}
                  setPage={setPage}
                />
              ) : (
                <></>
              )}
            </Stack>
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
      <Subscribe
        isOpen={isSubscribeModalOpen}
        setIsOpen={setIsSubscribeModalOpen}
        eventId={eid}
      />
      <PromoCodes
        isOpen={isPromoCodesModalOpen}
        setIsOpen={setIsPromoCodesModalOpen}
        eventId={eid}
      />
    </Box>
  );
};

export default Event;
