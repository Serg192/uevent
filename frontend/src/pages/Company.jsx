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
  Select,
  MenuItem,
  Switch,
} from "@mui/material";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  useGetCompanyMutation,
  useFollowCompanyMutation,
  useGetCompanyEventsMutation,
} from "../features/company/companyApiSlice";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  EditCompany,
  StripeMenu,
  EditEvent,
  PageController,
  EventSimplifiedPreview,
  EventCalendar,
} from "../components";
import { dateFilterOptions, getDatePeriod } from "../helpers/date-helper";

const Company = () => {
  const { cid } = useParams();

  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery("(min-width:850px)");

  const [companyData, setCompanyData] = useState(null);
  const [address, setAddress] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [followClicked, setFollowClicked] = useState(false);
  const [follower, setFollower] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [events, setEvents] = useState(null);
  const [selectedDateFilterOption, setSelectedDateFilterOption] =
    useState("All");

  const [showInCalendar, setShowInCalendar] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [page, setPage] = useState(1);
  const userData = useSelector(selectCurrentUser);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [getCompany] = useGetCompanyMutation();
  const [follow] = useFollowCompanyMutation();
  const [getEvents] = useGetCompanyEventsMutation();

  const loadCompanyEvents = async () => {
    const period = getDatePeriod(selectedDateFilterOption);

    try {
      const response = await getEvents({
        id: cid,
        page,
        pageSize: 5,
        ...(period && { startDate: period[0], endDate: period[1] }),
      }).unwrap();
      setEvents(response.data.data);
      setPaginationInfo({
        currentPage: response.data.currentPage,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
    } catch (err) {
      console.log();
    }
  };

  const loadCompanyData = async () => {
    try {
      const response = await getCompany({
        id: cid,
      }).unwrap();
      setCompanyData(response.data);
      setIsOwner(response.data.owner === userData?.user._id);
      setFollower(response.data.followers.includes(userData?.user._id));
      setAddress(response.data.address);
      await loadCompanyEvents();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCompanyEvents();
  }, [isEditEventModalOpen, page, selectedDateFilterOption]);

  useEffect(() => {
    loadCompanyData();
  }, [cid, isCompanyModalOpen, followClicked]);

  useEffect(() => {
    setSelectedDateFilterOption(dateFilterOptions[0]);
    loadCompanyEvents();
  }, [showInCalendar]);

  const handleFollow = async () => {
    if (!userData) {
      navigate("/login");
    }

    try {
      const response = await follow({ id: companyData._id }).unwrap();
      console.log(response);
      setFollowClicked(!followClicked);
    } catch (err) {}
  };

  return (
    <Box>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          height: 350,
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
            mb: 3,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <Avatar
            alt="Company Logo"
            src={companyData?.logo}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h3" gutterBottom>
            {companyData?.name}
          </Typography>
          <Stack direction="column" spacing={0.7} mt={1}>
            <Typography variant="h5" sx={{ color: "rgba(0, 0, 0, 0.5)" }}>
              Email: {companyData?.email}
            </Typography>
            <Typography variant="h5" sx={{ color: "rgba(0, 0, 0, 0.5)" }}>
              Address: {address}
            </Typography>
            <Typography variant="h5" sx={{ color: "rgba(0, 0, 0, 0.5)" }}>
              Followers: {companyData?.followers?.length}
            </Typography>
            {!isOwner && (
              <Button
                variant="contained"
                style={{
                  backgroundColor: follower
                    ? "rgba(147, 0, 230, 0.5)"
                    : "#9300E6",
                }}
                onClick={() => handleFollow()}
              >
                {follower ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Stack>
        </Paper>
      </Paper>
      {isOwner && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          p={1}
          spacing={2}
          width="100%"
        >
          <Button
            variant="contained"
            color="info"
            startIcon={<PaymentIcon />}
            onClick={() => {
              setIsStripeModalOpen(true);
            }}
          >
            Stripe
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setIsCompanyModalOpen(true);
            }}
          >
            Edit
          </Button>
        </Stack>
      )}
      <Stack direction={isLargeScreen ? "row" : "column"} width={"100%"}>
        <Box width={isLargeScreen ? "50%" : "100%"} p={2} ml={2}>
          <Typography variant="h5" sx={{ color: "rgba(0, 0, 0, 0.5)" }}>
            Address: {address}
          </Typography>
          {isLoaded && companyData && (
            <GoogleMap
              center={{
                lat: companyData?.location.coordinates[0],
                lng: companyData?.location.coordinates[1],
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
                  lat: companyData?.location.coordinates[0],
                  lng: companyData?.location.coordinates[1],
                }}
              />
            </GoogleMap>
          )}
        </Box>
        <Paper sx={{ p: 2, mt: 2, width: isLargeScreen ? "50%" : "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h5">Events</Typography>
              <Select
                value={selectedDateFilterOption}
                sx={{ width: "150px" }}
                onChange={(event) =>
                  setSelectedDateFilterOption(event.target.value)
                }
                variant="outlined"
                disabled={showInCalendar}
                fullWidth
              >
                {dateFilterOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5">Calendar:</Typography>
                <Switch
                  checked={showInCalendar}
                  onChange={() => {
                    setShowInCalendar((prev) => !prev);
                  }}
                  color="primary"
                />
              </Stack>
            </Stack>

            {isOwner && (
              <Button
                variant="contained"
                color="info"
                startIcon={<AddIcon />}
                onClick={() => {
                  setIsEditEventModalOpen(true);
                }}
              >
                Create
              </Button>
            )}
          </Stack>
          <Divider
            orientation="horizontal"
            sx={{ mt: 1, backgroundColor: "gray" }}
            flexItem
          />
          {!showInCalendar && (
            <Stack direction="column" alignItems="center" width="100%">
              {events?.map((e) => (
                <EventSimplifiedPreview key={e._id} event={e} />
              ))}
              {events?.length ? (
                <PageController
                  paginationInfo={paginationInfo}
                  setPage={setPage}
                />
              ) : (
                <></>
              )}
            </Stack>
          )}
          {showInCalendar && (
            <Box width="100%">
              <EventCalendar events={events} />
            </Box>
          )}
        </Paper>
      </Stack>
      <EditCompany
        isOpen={isCompanyModalOpen}
        setIsOpen={setIsCompanyModalOpen}
        initData={companyData}
      />
      <StripeMenu
        isOpen={isStripeModalOpen}
        setIsOpen={setIsStripeModalOpen}
        companyId={companyData?._id}
      />
      <EditEvent
        isOpen={isEditEventModalOpen}
        setIsOpen={setIsEditEventModalOpen}
        companyId={companyData?._id}
      />
    </Box>
  );
};

export default Company;
