import React, { useState } from "react";
import OrganizerDashboard from "./components/OrganizerDashboard";

// ...existing code...

function App() {
  // SAMPLE DATA (You can modify this)
  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      participantName: "Aarav Shetty",
      email: "aarav@gmail.com",
      phone: "9876543210",
      eventName: "Hackathon",
      date: "November 15, 2025",
      venue: "Main Auditorium - Room 101",
      status: "upcoming",
      result: ""
    },
    {
      id: 2,
      participantName: "Keerthi Rao",
      email: "keerthi@gmail.com",
      phone: "9876542222",
      eventName: "Technical Quiz",
      date: "November 17, 2025",
      venue: "Seminar Hall 1 - Room 205",
      status: "upcoming",
      result: ""
    },
    {
      id: 3,
      participantName: "Rohan Kumar",
      email: "rohan@gmail.com",
      phone: "9876541111",
      eventName: "Problem Solving",
      date: "October 20, 2025",
      venue: "Computer Lab A - Room 302",
      status: "completed",
      result: "Winner"
    },
    {
      id:4,
      participantName:'sneha patil',
      email:"sneha@gmil.com",
      phone:"8745125362",
      eventName:"Speed typing",
      date:"December 5,2025",
      venue:"Database Lab - Room 404",
      status:"upcoming",
      result:""
    },
  ]);

  // UPDATE EVENT DETAILS (Name, Date, Venue)
  const updateEventDetails = (oldEventName, newName, newDate, newVenue) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.eventName === oldEventName
          ? { ...reg, eventName: newName, date: newDate, venue: newVenue }
          : reg
      )
    );
  };

  // UPDATE PARTICIPANT RESULT
  const updateParticipantResult = (participantId, result) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === participantId ? { ...reg, result } : reg
      )
    );
  };

  return (
    <div>
      <OrganizerDashboard
        allRegistrations={registrations}
        onUpdateEventDetails={updateEventDetails}
        onUpdateParticipantResult={updateParticipantResult}
      />
    </div>
  );
}

export default App;
