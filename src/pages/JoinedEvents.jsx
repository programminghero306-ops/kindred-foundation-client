import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import EmptyState from "../components/EmptyState";
import EventCard from "../components/EventCard";
import Icon from "../components/Icon";
import Loader from "../components/Loader";
import { normalizeJoinedEvent } from "../utils";

export default function JoinedEvents() {
  const { user } = useAuth();
  const email = user?.email;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!email) return undefined;

    api
      .getJoinedEvents(email)
      .then((data) => {
        if (active) {
          setEvents(
            Array.isArray(data) ? data.map(normalizeJoinedEvent) : []
          );
        }
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

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <Icon name="heart" size={14} />
              Your plans
            </span>
            <h1>Joined events</h1>
            <p>Everything you have signed up for, sorted by event date.</p>
          </div>

          <Link to="/events" className="btn btn-outline">
            <Icon name="search" size={17} />
            Find more events
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading joined events..." />
        ) : error ? (
          <div className="alert alert-error">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon="heart"
            title="You have not joined an event yet"
            message="Browse upcoming events and find a cause that speaks to you."
            action={
              <Link to="/events" className="btn btn-primary">
                <Icon name="search" size={17} />
                Browse events
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
                <EventCard key={event._id || event.eventId} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
