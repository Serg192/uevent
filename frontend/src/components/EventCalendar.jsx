import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";

const EventCalendar = ({ events }) => {
  const navigate = useNavigate();
  const transformedEvents = events.map((event) => ({
    id: event._id,
    title: event.name,
    start: event.date,
    color: "#ff11ff",
  }));

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event._def.publicId !== "undefined") {
      navigate(`/events/${clickInfo.event._def.publicId}`);
    }
  };
  return (
    <Box>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        weekends={true}
        height="300px"
        events={transformedEvents}
        headerToolbar={false}
        eventContent={(eventInfo) => {
          return (
            <div
              style={{
                padding: "7px",
                backgroundColor: eventInfo.backgroundColor,
                color: "black",
                borderRadius: "5px",
                fontSize: "16px",
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {eventInfo.event.title}
            </div>
          );
        }}
        eventClick={handleEventClick}
      />
    </Box>
  );
};

export default EventCalendar;
