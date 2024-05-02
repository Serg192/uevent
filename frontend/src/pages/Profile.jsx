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

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, setUser } from "../features/auth/authSlice";

import { useGetSubscribedEventsMutation } from "../features/event/eventApiSlice";
import { useGetMeMutation, useUploadAvatarMutation } from "../features/user/userApiSlice";
import { useGetMyCompaniesMutation } from "../features/company/companyApiSlice";
import { PageController, EventPreview, CompanyPreview } from "../components";

const Profile = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectCurrentUser);
  const isLargeScreen = useMediaQuery("(min-width:850px)");

  const [subEvents, setSubEvents] = useState(null);  
  const [myCompanies, setMyCompanies] = useState(null);

  const [page, setPage] = useState(1);
  const [paginationCompInfo, setPaginationCompInfo] = useState({});
  const [paginationEventsInfo, setPaginationEventsInfo] = useState({});
  const [file, setFile] = useState();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  
  const [uploadAvatar] = useUploadAvatarMutation();
  const [getMe] = useGetMeMutation();
  const [getSubEvents] = useGetSubscribedEventsMutation();
  const [getMyCompanies] = useGetMyCompaniesMutation();

  const loadMyCompanies = async () => {
    setPage(1);
    setMyCompanies([]);

    try {
      let response = null;
      response = await getMyCompanies({ page, pageSize: 10 }).unwrap();
      setMyCompanies(response.data.data);

      if (response) {
        setPaginationCompInfo({
          currentPage: response.data.currentPage,
          pageSize: response.data.pageSize,
          total: response.data.total,
        });
      }
    } catch (err) {
      console.log(err);
    }

  };

  const loadSubscribedEvents = async () => {
    setPage(1);
    setSubEvents([]);

    try {
      let response = null;
      response = await getSubEvents({ page, pageSize: 10 }).unwrap();
      setSubEvents(response.result.data.map((d) => d.event));

      if (response) {
        setPaginationEventsInfo({
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
      const formData = new FormData();
      formData.append("image", file);
      try {
        const data = await uploadAvatar({
          formData,
        }).unwrap();

        setAvatar(data.url);
        const user = await getMe().unwrap();
        dispatch(setUser({ ...user }));
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

    loadMyCompanies();
    loadSubscribedEvents();
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
        </Paper>
      </Paper>

      <Stack direction={isLargeScreen ? "row" : "column"} width={"100%"}>
        <Paper sx={{ p: 2, m: 2, width: isLargeScreen ? "50%" : "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">My own Companies</Typography>
          </Stack>
          <Divider
            orientation="horizontal"
            sx={{ m: 1, backgroundColor: "gray" }}
            flexItem
          />
          <Stack direction="column" alignItems="center" width="100%">
            {myCompanies?.map((data) => (
              <CompanyPreview key={data._id} companyData={data} />
            ))}
            {myCompanies?.length ? (
              <PageController
                paginationInfo={paginationCompInfo}
                setPage={setPage}
              />
            ) : (
              <></>
            )}
          </Stack>
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
            sx={{ m: 1, backgroundColor: "gray" }}
            flexItem
          />
          <Stack direction="column" alignItems="center" width="100%">
            {subEvents?.map((data) => (
              <EventPreview key={data._id} eventData={data} />
            ))}
            {subEvents?.length ? (
              <PageController
                paginationInfo={paginationEventsInfo}
                setPage={setPage}
              />
            ) : (
              <></>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Profile;
