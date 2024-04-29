import React, { useState, useEffect } from "react";
import { ControlPanel, CalendarView } from "../components";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import { useGetCalendarDataWithFiltersMutation } from "../features/calendars/calendarsApiSlice";
import { useGetAllCalendarsMutation } from "../features/calendars/calendarsApiSlice";
import { useGetMeMutation } from "../features/user/userApiSlice";

import {
  setShouldUpdateEvents,
  selectShouldUpdateEvents,
} from "../features/calendars/calendarSlice";

import { setUser } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

import { CalendarEdit } from "../components";

const Welcome = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [currentCalendar, setCurrentCalendar] = useState("");
  const [eventFilter, setEventFilter] = useState({
    startAt: null,
    endAt: null,
    show: [],
  });

  //events from ... to
  const [startAt, setStartAt] = useState();
  const [endAt, setEndAt] = useState();

  const [currentCalendarData, setCurrentCalendarData] = useState({
    events: [],
  });
  const [calendarUserRole, setCalendarUserRole] = useState();
  const [showHolidays, setShowHolidays] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCalendar, setEditCalendar] = useState(false);

  const [calendarsData, setCalendarsData] = useState(null);
  const [loadCalendarData] = useGetCalendarDataWithFiltersMutation();
  const [loadCalendarList] = useGetAllCalendarsMutation();
  const [loadMe] = useGetMeMutation();

  const dispatch = useDispatch();
  const shoudUpdateEvents = useSelector(selectShouldUpdateEvents);

  const fetchCalendarsList = async () => {
    try {
      const response = await loadCalendarList().unwrap();
      setCalendarsData(response);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMe = async () => {
    try {
      const me = await loadMe().unwrap();
      dispatch(setUser(me.user));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      const calendar = await loadCalendarData({
        calendarId: currentCalendar.toString(),
        filter: {
          ...eventFilter,
        },
      }).unwrap();
      setCurrentCalendarData(calendar.calendarData);
      console.log("Calendar data was loaded, role ", calendar.me);
      setCalendarUserRole(calendar.me);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (currentCalendar) {
      fetchData();
    }
  }, [currentCalendar, eventFilter, calendarsData]);

  useEffect(() => {
    fetchCalendarsList();
    fetchMe();
  }, []);
  useEffect(() => {
    if (shoudUpdateEvents) {
      fetchData();
      dispatch(setShouldUpdateEvents(false));
    }
  }, [shoudUpdateEvents]);

  useEffect(() => {
    setEventFilter({ ...eventFilter, startAt, endAt });
  }, [startAt, endAt]);

  return (
    <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"}>
      <ControlPanel
        calendars={calendarsData?.calendars}
        currentCalendar={currentCalendar}
        setCurrentCalendar={setCurrentCalendar}
        eventFilter={eventFilter}
        setEventFilter={setEventFilter}
        showHolidays={showHolidays}
        setShowHolidays={setShowHolidays}
        setIsEditModalOpen={setIsModalOpen}
        setEditCalendar={setEditCalendar}
      />
      <Box flexGrow={1}>
        <CalendarView
          events={currentCalendarData?.events}
          setStartAt={setStartAt}
          setEndAt={setEndAt}
          showHolidays={showHolidays}
          currentCalendar={currentCalendar}
          calendarUserRole={calendarUserRole}
        />
      </Box>
      <CalendarEdit
        calendar={currentCalendarData}
        setCalendar={setCurrentCalendarData}
        currentUserRole={calendarUserRole}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        edit={editCalendar}
        calendarsList={calendarsData}
        setCalendarsList={setCalendarsData}
        setCurrentCalendar={setCurrentCalendar}
      />
    </Box>
  );
};

export default Welcome;
