import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import EmptyState from "../components/EmptyState";
import EventCard from "../components/EventCard";
import Icon from "../components/Icon";
import Loader from "../components/Loader";
import { eventTypeLabel } from "../utils";

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    let active = true;

    api
      .getEvents()
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
  }, []);

  const types = useMemo(
    () =>
      [...new Set(events.map((event) => event.eventType).filter(Boolean))].sort(),
    [events]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesType = type === "all" || event.eventType === type;
      const matchesSearch =
        !query ||
        [event.title, event.description, event.location, event.eventType]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return matchesType && matchesSearch;
    });
  }, [events, search, type]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <Icon name="calendar" size={14} />
              Upcoming
            </span>
            <h1>Find your next good deed</h1>
            <p>
              Every event below is open to the community. Pick one and show up.
            </p>
          </div>

          {user && (
            <Link to="/create-event" className="btn btn-primary">
              <Icon name="plus" size={17} />
              Create event
            </Link>
          )}
        </div>

        <div className="filters">
          <div className="search-box">
            <Icon name="search" size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events, places, or causes..."
              aria-label="Search events"
            />
          </div>

          <select
            className="filter-select"
            value={type}
            onChange={(event) => setType(event.target.value)}
            aria-label="Filter by event type"
          >
            <option value="all">All event types</option>
            {types.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventTypeLabel(eventType)}
              </option>
            ))}
          </select>
        </div>

        <p className="results-count">
          {filtered.length} {filtered.length === 1 ? "event" : "events"} found
        </p>

        {loading ? (
          <Loader label="Loading events..." />
        ) : error ? (
          <div className="alert alert-error">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="No events match your search"
            message="Try a different keyword or clear the filters to see everything."
            action={
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setSearch("");
                  setType("all");
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="event-grid">
            {filtered.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
