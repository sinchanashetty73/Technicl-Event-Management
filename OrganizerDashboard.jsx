import React, { useState } from "react";
import { Users, Calendar, MapPin, Plus, Edit, Trophy } from "lucide-react";
import "./dashboard.css";

/* ===========================================================
   NAVBAR
   =========================================================== */
function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-left">
        <span className="nav-logo">{`</>`}</span>
        <span className="nav-title">TechFest Portal</span>
      </div>

      <div className="nav-links">
        <a className="nav-link">Home</a>
        <a className="nav-link">Events</a>
        <a className="nav-link ">Dashboard</a>
      </div>

      <button className="logout-btn">
        <span style={{ marginRight: "6px" }}>⇦</span> Logout
      </button>
    </div>
  );
}

/* ===========================================================
   MAIN DASHBOARD
   =========================================================== */
export default function OrganizerDashboard({
  allRegistrations,
  onAddEvent,
  onUpdateEventDetails,
  onUpdateParticipantResult
}) {
  const [selectedTab, setSelectedTab] = useState("events");
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");

  /* ------------------ ADD EVENT ------------------ */
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newVenue, setNewVenue] = useState("");

  /* ------------------ EDIT EVENT ------------------ */
  const [editOpen, setEditOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editVenue, setEditVenue] = useState("");

  /* ------------------ VIEW RESULTS ------------------ */
  const [resultsOpen, setResultsOpen] = useState(false);
  const [selectedEventForResults, setSelectedEventForResults] = useState(null);
  const [participantResults, setParticipantResults] = useState({});

  /* ------------------ EVENT STATS ------------------ */
  const eventNames = Array.from(new Set(allRegistrations.map((r) => r.eventName)));

  const eventStats = eventNames.map((name, index) => {
    const regs = allRegistrations.filter((r) => r.eventName === name);
    const first = regs[0] || {};

    return {
      id: index + 1,
      name,
      totalRegistrations: regs.length,
      date: first.date ? first.date.split(",")[0] : "",
      venue: first.venue ? first.venue.split(" - ")[0] : "",
      status: first.status === "completed" ? "completed" : "upcoming",
    };
  });

  const totalParticipants = allRegistrations.length;

  /* ------------------ FILTER PARTICIPANTS ------------------ */
  const filteredParticipants =
    selectedEventFilter === "all"
      ? allRegistrations
      : allRegistrations.filter((p) => p.eventName === selectedEventFilter);

  /* ===========================================================
     ADD EVENT MODAL METHODS
     =========================================================== */
  const openAdd = () => {
    setNewName("");
    setNewDate("");
    setNewVenue("");
    setAddOpen(true);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newName || !newDate || !newVenue) return alert("Fill all fields");

    onAddEvent({
      id: Date.now(),
      participantName: "",
      email: "",
      phone: "",
      eventName: newName,
      date: newDate,
      venue: newVenue,
      status: "upcoming",
      result: ""
    });

    setAddOpen(false);
  };

  /* ===========================================================
     EDIT EVENT (FULLY FIXED)
     =========================================================== */
  const handleEditClick = (event) => {
    setEditingEvent(event);

    // Get REAL data from registrations
    const real = allRegistrations.find(r => r.eventName === event.name);

    setEditName(real?.eventName || event.name);
    setEditDate(real?.date || event.date);
    setEditVenue(real?.venue || event.venue);

    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editName || !editDate || !editVenue) return alert("Fill all fields");

    onUpdateEventDetails(
      editingEvent.name,  // old event name
      editName,           // new name
      editDate,           // new date
      editVenue           // new venue
    );

    setEditOpen(false);
    setEditingEvent(null);
  };

  /* ===========================================================
     RESULTS HANDLING
     =========================================================== */
  const handleViewResultsClick = (event) => {
    setSelectedEventForResults(event);

    const participants = allRegistrations.filter(
      r => r.eventName === event.name
    );

    const initial = {};
    participants.forEach(p => initial[p.id] = p.result || "");

    setParticipantResults(initial);
    setResultsOpen(true);
  };

  const handleSaveResults = () => {
    Object.entries(participantResults).forEach(([id, result]) => {
      if (result.trim()) {
        onUpdateParticipantResult(Number(id), result);
      }
    });

    setResultsOpen(false);
  };

  /* ===========================================================
     UI
     =========================================================== */
  return (
    <div className="page">

      <Navbar />

      <div className="page-inner">

        {/* ------------------ HEADER ------------------ */}
        <div className="top-row">
          <div>
            <h1 className="title">Organizer Dashboard</h1>
            <p className="subtitle">Manage events, participants, and venues</p>
          </div>

          <button className="add-btn" onClick={openAdd}>
            <Plus size={14} /> Add New Event
          </button>
        </div>

        {/* ------------------ TABS ------------------ */}
        <div className="tabs">
          <button className={selectedTab === "events" ? "tab active" : "tab"} onClick={() => setSelectedTab("events")}>Events Overview</button>
          <button className={selectedTab === "participants" ? "tab active" : "tab"} onClick={() => setSelectedTab("participants")}>Participants</button>
          <button className={selectedTab === "rooms" ? "tab active" : "tab"} onClick={() => setSelectedTab("rooms")}>Room Allocation</button>
        </div>

        {/* ===========================================================
           EVENTS OVERVIEW TAB
           =========================================================== */}
        {selectedTab === "events" && (
          <div className="events-card">
            <h2>Events Management</h2>

            <div className="events-list">
              {eventStats.map((ev) => (
                <div className="event-item" key={ev.id}>

                  <div>
                    <div className="event-title">
                      {ev.name}
                    </div>

                    <div className="event-meta">
                      <div className="meta-item"><Users size={14} /> {ev.totalRegistrations}</div>
                      <div className="meta-item"><Calendar size={14} /> {ev.date}</div>
                      <div className="meta-item"><MapPin size={14} /> {ev.venue}</div>
                    </div>
                  </div>

                  <div className="event-actions">
                    <button className="btn-outline" onClick={() => handleEditClick(ev)}><Edit size={14} /> Edit</button>
                    {/* {ev.status === "completed" && (
                      <button className="btn-primary" onClick={() => handleViewResultsClick(ev)}><Trophy size={14} /> Results</button>
                    )} */}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===========================================================
           PARTICIPANTS TAB
           =========================================================== */}
        {selectedTab === "participants" && (
          <div className="participants-card">
            <h2>Participant Management</h2>

            <select value={selectedEventFilter} onChange={(e) => setSelectedEventFilter(e.target.value)}>
              <option value="all">All Events</option>
              {eventStats.map((ev) => (
                <option key={ev.id} value={ev.name}>{ev.name}</option>
              ))}
            </select>

            <div className="participants-table">
              <div className="table-head">
                <div>Name</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Event</div>
                <div>Room</div>
              </div>

              {filteredParticipants.map((p) => (
                <div className="table-row" key={p.id}>
                  <div>{p.participantName || "-"}</div>
                  <div>{p.email || "-"}</div>
                  <div>{p.phone || "-"}</div>
                  <div>{p.eventName}</div>
                  <div>{p.venue?.split(" - ")[1] || "N/A"}</div>
                </div>
              ))}

              {filteredParticipants.length === 0 && (
                <div className="no-data">No participants</div>
              )}
            </div>
          </div>
        )}

        {/* ===========================================================
   ROOM ALLOCATION TAB (UPDATED)
   =========================================================== */}
{selectedTab === "rooms" && (
  <div className="rooms-card">
    
    <h2>Room Allocation</h2>
    <p className="muted">
      Assign rooms and venues to participants. Updating event details will automatically update this section.
    </p>

    <div className="rooms-grid">

      {/* ===== Main Auditorium ===== */}
      <div className="room-card pink-card">
        <h3>Main Auditorium</h3>
        <p className="muted">
          Capacity: 100 | Assigned: {
            allRegistrations.filter(r => r.venue.includes("Main Auditorium")).length
          }
        </p>

        <div className="room-detail">
          {
            allRegistrations
              .filter(r => r.venue.includes("Main Auditorium"))
              .map(r => (
                <div key={r.id} className="room-event">
                  <span>{r.eventName}</span> – 
                  <span className="room-number">{r.venue.split(" - ")[1]}</span>
                </div>
              ))
          }

          {allRegistrations.filter(r => r.venue.includes("Main Auditorium")).length === 0 && (
            <div className="available-text">Available</div>
          )}
        </div>
      </div>

      {/* ===== Computer Lab A ===== */}
      <div className="room-card purple-card">
        <h3>Computer Lab A</h3>
        <p className="muted">
          Capacity: 50 | Assigned: {
            allRegistrations.filter(r => r.venue.includes("Computer Lab A")).length
          }
        </p>

        <div className="room-detail">
          {
            allRegistrations
              .filter(r => r.venue.includes("Computer Lab A"))
              .map(r => (
                <div key={r.id} className="room-event">
                  <span>{r.eventName}</span> – 
                  <span className="room-number">{r.venue.split(" - ")[1]}</span>
                </div>
              ))
          }

          {allRegistrations.filter(r => r.venue.includes("Computer Lab A")).length === 0 && (
            <div className="available-text">Available</div>
          )}
        </div>
      </div>

      {/* ===== Seminar Hall 1 ===== */}
      <div className="room-card blue-card">
        <h3>Seminar Hall 1</h3>
        <p className="muted">
          Capacity: 60 | Assigned: {
            allRegistrations.filter(r => r.venue.includes("Seminar Hall 1")).length
          }
        </p>

        <div className="room-detail">
          {
            allRegistrations
              .filter(r => r.venue.includes("Seminar Hall 1"))
              .map(r => (
                <div key={r.id} className="room-event">
                  <span>{r.eventName}</span> – 
                  <span className="room-number">{r.venue.split(" - ")[1]}</span>
                </div>
              ))
          }

          {allRegistrations.filter(r => r.venue.includes("Seminar Hall 1")).length === 0 && (
            <div className="available-text">Available</div>
          )}
        </div>
      </div>

      {/* ===== Database Lab ===== */}
      <div className="room-card gray-card">
        <h3>Database Lab</h3>
        <p className="muted">Capacity: 40 | Assigned: 0</p>
        <div className="available-text"></div>
      </div>

    </div>
  </div>
)}
{/* ===========================================================
           ADD EVENT MODAL
           ===========================================================  */}
        {addOpen && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Create New Event</h3>

              <form className="form" onSubmit={handleCreateEvent}>
                <label>Event Name</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} />

                <label>Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />

                <label>Venue</label>
                <input value={newVenue} onChange={(e) => setNewVenue(e.target.value)} placeholder="Main Auditorium - Room 101" />

                <div className="modal-actions">
                  <button type="button" className="btn-outline" onClick={() => setAddOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Create Event</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===========================================================
           EDIT EVENT MODAL
           =========================================================== */}
        {editOpen && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Edit Event</h3>
              <p className="muted">Update event details. All participants will see the updated information.</p>

              <label>Event Name</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} />

              <label>Date</label>
              <input value={editDate} onChange={(e) => setEditDate(e.target.value)} />

              <label>Venue</label>
              <input value={editVenue} onChange={(e) => setEditVenue(e.target.value)} placeholder="Main Auditorium - Room 101" />

              <div className="modal-actions">
                <button className="btn-outline" onClick={() => setEditOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSaveEdit}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
