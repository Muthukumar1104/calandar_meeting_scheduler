import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Badge,
  Box,
  IconButton,
  Divider,
  Popover,
} from "@mui/material";
import {
  VideoCall,
  RemoveRedEye,
  Download,
  CancelRounded,
  BorderColorRounded,
  DeleteOutlineRounded,
} from "@mui/icons-material";
import { green, blue, yellow, grey } from "@mui/material/colors";
import calendarData from "../../calendarfromtoenddate.json";
import calendarMeetings from "../../calendar_meeting.json";
import { images } from "../../assets/images";
import "./Calandar.css";

const CalendarScheduler = () => {
  const rawEvents = [...calendarData, calendarMeetings];

  const actualevents = rawEvents.map((event) => ({
    id: event.id,
    title: event.user_det.job_id.jobRequest_Title,
    interviewer: event.user_det.handled_by.firstName,
    start: moment(event.start).toISOString(),
    end: moment(event.end).toISOString(),
    description: event.desc,
    email: event.user_det.candidate.candidate_email,
    meetingType: "Google Meet",
    meetingLink: event.link,
  }));

  // Group events by start time
  const groupedEvents = rawEvents.reduce((acc, event) => {
    const eventTime = moment(event.start).format("YYYY-MM-DD HH:mm");
    if (!acc[eventTime]) {
      acc[eventTime] = [];
    }
    acc[eventTime].push({
      id: event.id,
      title: event.user_det.job_id.jobRequest_Title,
      interviewer: event.user_det.handled_by.firstName,
      start: moment(event.start).toISOString(),
      end: moment(event.end).toISOString(),
      description: event.desc,
      email: event.user_det.candidate.candidate_email,
      meetingType: "Google Meet",
      meetingLink: event.link,
    });
    return acc;
  }, {});

  // Format events to display only the first event with a count badge
  const formattedEvents = Object.keys(groupedEvents).map((eventTime) => {
    const firstEvent = groupedEvents[eventTime][0];
    return {
      id: firstEvent.id,
      title: firstEvent.title,
      start: firstEvent.start,
      end: firstEvent.end,
      eventTime,
      count: groupedEvents[eventTime].length,
      interviewer: firstEvent.interviewer,
      description: firstEvent.description,
    };
  });

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventListOpen, setEventListOpen] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);

  // Handle click on calendar event
  const handleEventClick = (info) => {
    const clickedTime = moment(info.event.start).format("YYYY-MM-DD HH:mm");
    setSelectedEvents(groupedEvents[clickedTime]);
    setEventListOpen(true);
    setPopoverAnchor(info.el);
  };

  // Handle click on event card
  const handleEventCardClick = (event) => {
    setSelectedEvent(event);
    setEventListOpen(false);
  };

  // Join meeting
  const handleJoinMeeting = (meetingLink) => {
    window.open(meetingLink, "_blank");
  };

  return (
    <div className="calendar_scheduler">
      <FullCalendar
        key={JSON.stringify(formattedEvents)}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        timeZone="local"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth",
        }}
        buttonText={{
          timeGridDay: "Day",
          timeGridWeek: "Week",
          dayGridMonth: "Month",
        }}
        initialView="dayGridMonth"
        editable={false}
        selectable={false}
        selectMirror={false}
        dayMaxEvents={false}
        events={formattedEvents}
        eventClick={handleEventClick}
        // slotMinTime="08:00:00"
        // slotMaxTime="24:00:00"
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          omitZeroMinute: false,
          meridiem: "short",
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }}
        eventContent={(eventInfo) => {
          const eventCount = actualevents.filter((e) =>
            moment(e.start).isSame(moment(eventInfo.event.start), "minute")
          ).length;

          const eventDetails = formattedEvents.find((e) =>
            moment(e.start).isSame(moment(eventInfo.event.start), "minute")
          );

          return (
            <div>
              <Box
                sx={{
                  position: "block",
                  display: "flex",
                  alignItems: "center",
                  // background: eventCount > 1 ? "#00a6ff29" : "#fffffff",
                  background: "#00a6ff29",
                  padding: "0px 5px",
                  borderLeft: "13px solid #0000ffc7",
                  position: "relative",
                  boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.5)",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ color: grey[800], mb: 0, fontSize: "11px" }}
                  >
                    {eventInfo.event.title}
                  </Typography>
                  <Typography
                    sx={{ color: grey[800], mb: 0, fontSize: "11px" }}
                  >
                    Interview With : {eventDetails?.interviewer}
                  </Typography>
                  <Typography
                    sx={{ color: grey[800], mb: 0, fontSize: "11px" }}
                  >
                    Time :{" "}
                    {`${moment(eventDetails?.start).format(
                      "hh:mm A"
                    )} - ${moment(eventDetails?.end).format("hh:mm A")}`}
                  </Typography>
                </Box>
                {eventCount > 1 && (
                  <Badge
                    badgeContent={eventCount}
                    color="warning"
                    sx={{
                      marginLeft: "8px",
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "#E9DB5D",
                      color: "black",
                    }}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  />
                )}
              </Box>

              <Popover
                open={Boolean(eventListOpen)}
                anchorEl={popoverAnchor}
                onClose={() => setEventListOpen(false)}
                anchorOrigin={{
                  vertical: "left",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "right",
                  horizontal: "left",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  margin="0px 2px 0px 15px"
                >
                  <Typography sx={{ color: grey[800], fontSize: "13.5px" }}>
                    Meetings
                  </Typography>
                  <IconButton
                    sx={{ color: blue[700] }}
                    onClick={() => setEventListOpen(false)}
                  >
                    <CancelRounded />
                  </IconButton>
                </Box>
                <Divider sx={{ borderColor: "gray", mb: 1 }} />
                {selectedEvents?.map((event, i) => (
                  <>
                    <Box
                      sx={{
                        position: "block",
                        display: "flex",
                        alignItems: "center",
                        background: "#fff",
                        padding: "7px 5px",
                        borderLeft: "13px solid #0000ffc7",
                        cursor: "pointer",
                        marginBottom: "8px",
                      }}
                      onClick={() => handleEventCardClick(event)}
                    >
                      <Box
                        sx={{
                          display: "block",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{ color: grey[800], mb: 1.5, fontSize: "12px" }}
                          >
                            {event?.title}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0,
                            }}
                          >
                            <IconButton sx={{ color: "black" }}>
                              <BorderColorRounded sx={{ fontSize: 15 }} />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteOutlineRounded sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "between",
                            gap: 0,
                          }}
                        >
                          <Typography
                            sx={{ color: grey[800], mb: 1, fontSize: "12px" }}
                          >
                            {eventDetails?.description}
                          </Typography>
                          <Divider
                            sx={{
                              borderColor: "#80808073",
                              borderWidth: "1px",
                              height: "15px",
                              marginLeft: "10px",
                              marginRight: "10px",
                              marginTop: "1px",
                            }}
                            orientation="vertical"
                            variant="middle"
                            flexItem
                          />
                          <Typography
                            sx={{ color: grey[800], mb: 1, fontSize: "12px" }}
                          >
                            Interview With : {eventDetails?.interviewer}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0,
                          }}
                        >
                          <Typography
                            sx={{ color: grey[800], mb: 0, fontSize: "12px" }}
                          >
                            Date : {moment(event?.start).format("DD MMM YYYY")}
                          </Typography>
                          <Divider
                            sx={{
                              borderColor: "#80808073",
                              borderWidth: "1px",
                              height: "15px",
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            orientation="vertical"
                            variant="middle"
                            flexItem
                          />
                          <Typography
                            sx={{ color: grey[800], mb: 0, fontSize: "12px" }}
                          >
                            Time :{" "}
                            {`${moment(event?.start).format(
                              "hh:mm A"
                            )} - ${moment(event?.end).format("hh:mm A")}`}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {i == selectedEvents?.length - 2 && (
                      <Divider sx={{ borderColor: "gray", mb: 1 }} />
                    )}
                  </>
                ))}
              </Popover>
            </div>
          );
        }}
      />

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog
          open={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
        >
          <IconButton
            aria-label="close"
            onClick={() => setSelectedEvent(null)}
            sx={() => ({
              position: "absolute",
              right: 0,
              top: 0,
              color: blue[700],
            })}
          >
            <CancelRounded />
          </IconButton>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                border: "1px solid #8080804a",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  borderRight: "1px solid #8080804a",
                  padding: "7px",
                }}
              >
                <Typography sx={{ color: grey[800], mb: 2, fontSize: "13px" }}>
                  Interview With : {selectedEvent.interviewer}
                </Typography>
                <Typography sx={{ color: grey[800], mb: 2, fontSize: "13px" }}>
                  Position : {selectedEvent.title}
                </Typography>
                <Typography sx={{ color: grey[800], mb: 2, fontSize: "13px" }}>
                  Created By:-
                </Typography>
                <Typography sx={{ color: grey[800], mb: 2, fontSize: "13px" }}>
                  Interview Date :{" "}
                  {moment(selectedEvent.start).format("DD MMM YYYY")}
                </Typography>
                <Typography sx={{ color: grey[800], mb: 2, fontSize: "13px" }}>
                  Interview Time :{" "}
                  {`${moment(selectedEvent.start).format("hh:mm A")} - ${moment(
                    selectedEvent.end
                  ).format("hh:mm A")}`}
                </Typography>
                <Typography sx={{ color: grey[800], mb: 2, fontSize: "13px" }}>
                  Interview Via : {selectedEvent.meetingType}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid #1976d2",
                    color: blue[700],
                    width: "100%",
                    textTransform: "none",
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "white" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  Resume <RemoveRedEye sx={{ fontSize: 18 }} />{" "}
                  <Download sx={{ fontSize: 18 }} />
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid #1976d2",
                    color: blue[700],
                    width: "100%",
                    textTransform: "none",
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "white" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  Aahaarcard <RemoveRedEye sx={{ fontSize: 18 }} />{" "}
                  <Download sx={{ fontSize: 18 }} />
                </Button>
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  padding: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ marginBottom: 2, border: "1px solid #8080804a" }}>
                  <img
                    src={images?.google_meet_logo}
                    alt="Google Meet Logo"
                    style={{ width: 100, height: 100, padding: 0 }}
                  />
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: blue[700],
                    color: "white",
                    padding: "5px 7px",
                    textTransform: "none",
                    borderRadius: 1,
                    "&:hover": { backgroundColor: blue[700] },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                  onClick={() => handleJoinMeeting(selectedEvent.meetingLink)}
                >
                  <VideoCall sx={{ fontSize: 18 }} /> Join
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CalendarScheduler;
