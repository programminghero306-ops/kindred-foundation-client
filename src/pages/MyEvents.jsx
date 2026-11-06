import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import EmptyState from "../components/EmptyState";
import EventCard from "../components/EventCard";
import Icon from "../components/Icon";
import Loader from "../components/Loader";

export default function MyEvents() {
  const { user } = useAuth();
  const email = user?.email;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let active = true;

    if (!email) return undefined;

    api
      .getMyEvents(email)
      .then((data) => {
        if (active) setEvents(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [email]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;

    setDeletingId(id);
    setError("");

    try {
      await api.deleteEvent(id);
      setEvents((current) => current.filter((event) => event._id !== id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <Icon name="user" size={14} />
              Your dashboard
            </span>
            <h1>My events</h1>
            <p>Events you created. Edit the details or remove an event.</p>
          </div>

          <Link to="/create-event" className="btn btn-primary">
            <Icon name="plus" size={17} />
            Create event
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading your events..." />
        ) : error ? (
          <div className="alert alert-error">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="You have not created an event yet"
            message="Start something small. Invite your neighbors and make it happen."
            action={
              <Link to="/create-event" className="btn btn-primary">
                <Icon name="plus" size={17} />
                Create your first event
              </Link>
            }
          />
        ) : (
          <>
            <p className="results-count">
              {events.length} {events.length === 1 ? "event" : "events"}
            </p>
            <div className="event-grid">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  actions={
                    <>
                      <Link
                        to={`/events/${event._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View
                      </Link>
                      <Link
                        to={`/events/${event._id}/edit`}
                        className="btn btn-outline btn-sm"
                      >
                        <Icon name="edit" size={15} />
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(event._id)}
                        disabled={deletingId === event._id}
                      >
                        <Icon name="trash" size={15} />
                        {deletingId === event._id ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
