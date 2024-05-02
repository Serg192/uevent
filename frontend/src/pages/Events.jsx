import React, { useState, useEffect } from "react";
import { Stack, Typography, Button, Select, MenuItem } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { EventPreview, PageController } from "../components";

import {
  useGetAllEventsMutation,
  useGetSubscribedEventsMutation,
} from "../features/event/eventApiSlice";

const Events = () => {
  const options = ["All", "Subscribed"];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [displayEvents, setDisplayEvents] = useState(true);
  const [events, setEvents] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [page, setPage] = useState(1);

  // const navigate = useNavigate();
  const userData = useSelector(selectCurrentUser);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const [getAll] = useGetAllEventsMutation();
  const [getSubscribed] = useGetSubscribedEventsMutation();
  // const [getMy] = useGetMyEventsMutation();

  const loadEvents = async () => {
    if (displayEvents) {
      setPage(1);
      setEvents([]);
      try {
        let response = null;
        switch (selectedOption) {
          case "All":
            response = await getAll({ page, pageSize: 10 }).unwrap();
            setEvents(response.result.data);
            break;
          case "Subscribed":
            response = await getSubscribed({ page, pageSize: 10 }).unwrap();
            setEvents(response.result.data);
            break;
          default:
        }
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
    }
  };

  useEffect(() => {
    console.log(`${selectedOption}`);
    setDisplayEvents(!(selectedOption !== "All" && !userData));
    loadEvents();
  }, [selectedOption, page, userData]);

  // const handleCreate = () => {
  //   if (!userData) navigate("/login");
  //   else setIsModalOpen(true);
  // };

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
        <Typography variant="h2">Events</Typography>
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
        {/* <Button
          variant="contained"
          onClick={handleCreate}
          startIcon={<AddIcon />}
          sx={{ pl: 5, pr: 5 }}
        >
          Create
        </Button> */}
      </Stack>
      {selectedOption !== "All" && !userData && (
        <Typography variant="h4">You should log in to see this data</Typography>
      )}
      {displayEvents &&
        events?.map((data) => <EventPreview eventData={data} />)}
      {/* <EditEvent isOpen={isModalOpen} setIsOpen={setIsModalOpen} /> */}
      {events?.length ? (
        <PageController paginationInfo={paginationInfo} setPage={setPage} />
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default Events;
