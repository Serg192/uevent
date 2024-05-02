import React, { useState, useEffect } from "react";
import { Stack, Typography, Select, MenuItem, Grid } from "@mui/material";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { EventPreview, PageController, SearchBar } from "../components";

import {
  useGetAllEventsMutation,
  useGetSubscribedEventsMutation,
} from "../features/event/eventApiSlice";

import { dateFilterOptions, getDatePeriod } from "../helpers/date-helper";
import { getNextMonth, getNextWeek, getToday } from "../helpers/date-helper";

const Events = () => {
  const options = ["All", "Subscribed"];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [events, setEvents] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [page, setPage] = useState(1);
  const [selectedDateFilterOption, setSelectedDateFilterOption] = useState("All");

  const [searchPattern, setSearchPattern] = useState();

  const userData = useSelector(selectCurrentUser);

  const [getAll] = useGetAllEventsMutation();
  const [getSubscribed] = useGetSubscribedEventsMutation();

  const loadEvents = async () => {
    setPage(1);
    setEvents([]);
    if (
      selectedOption === "Subscribed" && !userData
    ) {
      return;
    }
    try {
      let response = null;
      switch (selectedOption) {
        case "All":
          response = await getAll({
            page,
            pageSize: 10,
            ...(searchPattern?.length && { search: searchPattern }),
          }).unwrap();
          setEvents(response.result.data);
          console.log(response.result.data);
          break;
        case "Subscribed":
          response = await getSubscribed({ page, pageSize: 10 }).unwrap();
          setEvents(response.result.data.map((d) => d.event));

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
  };

  useEffect(() => {
    loadEvents();
  }, [selectedOption, page, userData, selectedDateFilterOption]);

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
          <Select
            value={selectedDateFilterOption}
            onChange={(event) =>
              setSelectedDateFilterOption(event.target.value)
            }
            variant="outlined"
            fullWidth
          >
            {dateFilterOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        <SearchBar setPattern={setSearchPattern} callback={loadEvents} />
      </Stack>
      {selectedOption !== "All" && !userData && (
        <Typography variant="h4">You should log in to see this data</Typography>
      )}
      <Grid sx={{width:"100%"}} container spacing={2}>
        {events?.map((data) => (
          <Grid item key={data._id} xs={12} sm={6} md={4} lg={4}>
            <EventPreview eventData={data} />
          </Grid>
        ))}
      </Grid>

      {events?.length ? (
        <PageController paginationInfo={paginationInfo} setPage={setPage} />
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default Events;
