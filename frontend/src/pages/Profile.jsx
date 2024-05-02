import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Stack,
  Avatar,
  useMediaQuery,
  Button,
  Divider,
} from "@mui/material";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

import { useGetSubscribedEventsMutation } from "../features/event/eventApiSlice";

import { useUploadAvatarMutation } from "../features/user/userApiSlice";

import { PageController, EventSimplifiedPreview } from "../components";

const Profile = () => {
  const userData = useSelector(selectCurrentUser);
  const isAdmin = userData?.user?.role === "admin";
  const isLargeScreen = useMediaQuery("(min-width:850px)");

  const [events, setEvents] = useState(null);
  // const [getEvents] = useGetCompanyEventsMutation();
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [file, setFile] = useState();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [getSubscribed] = useGetSubscribedEventsMutation();
  const [uploadAvatar] = useUploadAvatarMutation();

  const loadSubscribedEvents = async () => {
    console.log("start");
    setPage(1);
    setEvents([]);
    try {
      let response = null;
      response = await getSubscribed({ page, pageSize: 10 }).unwrap();
      console.log(response.result.data);
      setEvents(response.result.data);

      console.log(events);

      if (response) {
        setPaginationInfo({
          currentPage: response.result.currentPage,
          pageSize: response.result.pageSize,
          total: response.result.total,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAvatarUpload = async () => {
    if (file) {
      console.log("User:");
      console.log(userData);
      const formData = new FormData();
      formData.append("image", file);
      try {
        console.log(formData);
        const data = await uploadAvatar({
          id: userData.user._id,
          formData,
        }).unwrap();

        console.log("Data:");
        console.log(data);
        setAvatar(data.url);
      } catch (err) {
        console.error("Error uploading photo:", err);
      }
    }
  };

  useEffect(() => {
    if (userData) {
      setName(userData.user?.username);
      setAvatar(userData.user?.profilePicture);
    }
    // loadSubscribedEvents();
  }, [userData]);

  return (
    <Box>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          height: "25%",
          background: "linear-gradient(45deg, #B94DFF 30%, #DFB3FF 90%)",
        }}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 450,
            height: "100%",
            p: 2,
            mb: 2,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <Avatar
            alt="User Avatar"
            src={avatar}
            sx={{ width: 175, height: 175, mb: 2 }}
          />
          <Typography variant="h3" gutterBottom>
            {name}
          </Typography>
          <input
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <Button
            variant="contained"
            sx={{
              mt: 2,
            }}
            onClick={() => handleAvatarUpload()}
          >
            Change Avatar
          </Button>

          {isAdmin && (
            <Button
              variant="contained"
              sx={{
                mt: 2,
              }}
            >
              Admin Panel
            </Button>
          )}
        </Paper>
      </Paper>

      <Stack direction={isLargeScreen ? "row" : "column"} width={"100%"}>
        <Paper sx={{ p: 2, m: 2, width: isLargeScreen ? "50%" : "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">My Events</Typography>
          </Stack>
          <Divider
            orientation="horizontal"
            sx={{ mt: 1, backgroundColor: "gray" }}
            flexItem
          />
          {/* <Stack direction="column" alignItems="center" width="100%">
            {events?.map((e) => (
              <EventSimplifiedPreview event={e} />
            ))}
            {events?.length ? (
              <PageController
                paginationInfo={paginationInfo}
                setPage={setPage}
              />
            ) : (
              <></>
            )}
          </Stack> */}
        </Paper>
        <Paper sx={{ p: 2, m: 2, width: isLargeScreen ? "50%" : "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">My Tickets</Typography>
          </Stack>
          <Divider
            orientation="horizontal"
            sx={{ mt: 1, backgroundColor: "gray" }}
            flexItem
          />
          {/* <Stack direction="column" alignItems="center" width="100%">
            {events?.map((e) => (
              <EventSimplifiedPreview event={e} />
            ))}
            {events?.length ? (
              <PageController
                paginationInfo={paginationInfo}
                setPage={setPage}
              />
            ) : (
              <></>
            )}
          </Stack> */}
        </Paper>
      </Stack>
    </Box>
  );
};

export default Profile;
