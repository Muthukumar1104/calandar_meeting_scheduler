import React, { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { Typography, Button, Box } from "@mui/material";
import { VideoCall } from "@mui/icons-material";
import { green, blue, yellow, grey } from "@mui/material/colors";
import moment from "moment";
import calendarfromtoenddate from "../../calendarfromtoenddate.json";
import calendar_meeting from "../../calendar_meeting.json";
import { images } from "../../assets/images";
import "./Calandar.css";

const Calandarscheduler = () => {
  const data = [...calendarfromtoenddate, calendar_meeting];

  const formattedEvents = data.map((event) => ({
    event_id: event.id,
    title: event.user_det.job_id.jobRequest_Title,
    interviewer: event.user_det.handled_by.firstName,
    start: new Date(event.start),
    end: new Date(event.end),
    description: event.desc,
    email: event.user_det.candidate.candidate_email,
    meetingType: "Google Meet",
    meetingLink: event.link,
  }));

  const [events, setEvents] = useState(formattedEvents);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleConfirm = (event, action) => {
    if (action === "create") {
      setEvents([...events, { ...event, event_id: events.length + 1 }]);
    } else if (action === "edit") {
      setEvents(events.map((e) => (e.event_id === event.event_id ? event : e)));
    }
    return Promise.resolve({
      ...event,
      event_id: event.event_id || events.length + 1,
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleJoin = (meetingLink) => {
    window.open(meetingLink, "_blank");
  };

  return (
    <div className="calandar_scheduler">
      <Scheduler
        view="month"
        events={events}
        agenda={false}
        onConfirm={handleConfirm}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
        onDelete={(event_id) => {
          setEvents(events.filter((event) => event.event_id !== event_id));
        }}
        week={{ startHour: 9, endHour: 24, step: 60 }}
        day={{ startHour: 9, endHour: 24, step: 60 }}
        fields={[
          {
            name: "position",
            type: "input",
            config: {
              label: "Position",
              required: true,
              min: 3,
              variant: "outlined",
            },
          },
          {
            name: "description",
            type: "input",
            config: {
              label: "Description",
              required: true,
              min: 3,
              variant: "outlined",
            },
          },
          {
            name: "email",
            type: "input",
            config: {
              label: "Candidate Email",
              required: true,
              email: true,
              variant: "outlined",
            },
          },
          {
            name: "interviewer",
            type: "input",
            config: {
              label: "Interviwer",
              required: true,
              min: 3,
              variant: "outlined",
            },
          },
          {
            name: "meetingType",
            type: "input",
            config: {
              label: "Meeting Type",
              required: true,
              min: 3,
              variant: "outlined",
            },
          },
          {
            name: "meetingLink",
            type: "input",
            config: {
              label: "Meeting Link",
              required: true,
              min: 3,
              variant: "outlined",
            },
          },
        ]}
        viewerExtraComponent={(fields, event) => (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 1,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ color: grey[800], mb: 1 }}>
                  <p>
                    <strong>Interview With:</strong>
                  </p>{" "}
                  {event.interviewer}
                </Typography>
                <Typography variant="body1" sx={{ color: grey[800], mb: 1 }}>
                  <p>
                    <strong>Position:</strong>
                  </p>{" "}
                  {event.title}
                </Typography>
                <Typography variant="body1" sx={{ color: grey[800], mb: 1 }}>
                  <p>
                    <strong>Interview Date:</strong>
                  </p>{" "}
                  {moment(event.start).format("DD MMM YYYY")}
                </Typography>
                <Typography variant="body1" sx={{ color: grey[800], mb: 1 }}>
                  <p>
                    <strong>Interview Time:</strong>
                  </p>{" "}
                  {`${moment(event.start).format("hh:mm A")} - ${moment(
                    event.end
                  ).format("hh:mm A")}`}
                </Typography>
                <Typography variant="body1" sx={{ color: grey[800], mb: 1 }}>
                  <p>
                    <strong>Meeting Via:</strong>
                  </p>{" "}
                  {event.meetingType}
                </Typography>
              </Box>

              <Box
                sx={{
                  flexShrink: 0,
                  paddingLeft: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ marginBottom: 2 }}>
                  <img
                    src={images?.google_meet_logo}
                    alt="Google Meet Logo"
                    style={{ width: 180, height: 180 }}
                  />
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: green[500],
                    color: "white",
                    padding: "10px 20px",
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": { backgroundColor: green[700] },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                  onClick={() => handleJoin(event.meetingLink)}
                >
                  <VideoCall sx={{ fontSize: 20 }} /> Join Meeting
                </Button>
              </Box>
            </Box>
          </>
        )}
      />

      {selectedDate && (
        <div>
          <Typography variant="h6">
            Events on {selectedDate.toLocaleDateString()}
          </Typography>
          {events
            .filter(
              (e) =>
                e.start.toLocaleDateString() ===
                selectedDate.toLocaleDateString()
            )
            .map((event) => (
              <div key={event.event_id} onClick={() => handleEventClick(event)}>
                <Typography>{event.title}</Typography>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Calandarscheduler;
