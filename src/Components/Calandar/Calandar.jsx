import React, { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import {
  Typography,
  Button,
  Badge,
  Card,
  CardContent,
  Divider,
  Box,
} from "@mui/material";
import { VideoCall } from "@mui/icons-material";
import { green, blue, yellow, grey } from "@mui/material/colors";
import moment from "moment";
import calendarfromtoenddate from "../../calendarfromtoenddate.json";
import calendar_meeting from "../../calendar_meeting.json";
import unique_id from "generate-unique-id";
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
        onConfirm={handleConfirm}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
        onDelete={(event_id) => {
          setEvents(events.filter((event) => event.event_id !== event_id));
        }}
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
          <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
            <Card
              sx={{
                backgroundColor: blue[50],
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: 800,
                width: "100%",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, paddingRight: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: blue[800],
                        marginBottom: 1,
                      }}
                    >
                      Event Details
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />

                    <Typography
                      variant="body1"
                      sx={{ color: grey[800], mb: 1 }}
                    >
                      <strong>Interview With:</strong> {event.interviewer}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: grey[800], mb: 1 }}
                    >
                      <strong>Position:</strong> {event.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: grey[800], mb: 1 }}
                    >
                      <strong>Interview Date:</strong>{" "}
                      {moment(event.start).format("DD MMM YYYY")}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: grey[800], mb: 1 }}
                    >
                      <strong>Interview Time:</strong>{" "}
                      {`${moment(event.start).format("hh:mm A")} - ${moment(
                        event.end
                      ).format("hh:mm A")}`}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: grey[800], mb: 1 }}
                    >
                      <strong>Meeting Via:</strong> {event.meetingType}
                    </Typography>
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
              </CardContent>
            </Card>
          </Box>
        )}
        eventTemplate={(event) => {
          const eventCount = events.filter(
            (e) => e.start.getTime() === event.start.getTime()
          ).length;
          return (
            <>
              <Typography>{event.title}</Typography>
              {eventCount > 1 && (
                <Badge
                  color="primary"
                  badgeContent={eventCount}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "gold",
                    borderRadius: "50%",
                    padding: "5px",
                  }}
                />
              )}
            </>
          );
        }}
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
