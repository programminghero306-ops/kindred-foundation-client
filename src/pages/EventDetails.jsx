import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import Icon from "../components/Icon";
import Loader from "../components/Loader";
import {
  eventTypeLabel,
  formatDate,
  isEventCreator,
} from "../utils";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinedMessage, setJoinedMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  const email = user?.email;

  useEffect(() => {
    let active = true;

    async function loadEvent() {
      setLoading(true);
      setError("");

      try {
        const data = await api.getEvent(id);
        if (!active) return;
        setEvent(data);

        if (email) {
          try {
            const joinedEvents = await api.getJoinedEvents(email);
            if (active) {
              setJoined(
                joinedEvents.some(
                  (item) =>
                    String(item.eventId || item._id) === String(id)
                )
              );
            }
          } catch {
            // Joined status is a nice-to-have; the event still loads.
          }
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadEvent();

    return () => {
      active = false;
    };
  }, [id, email]);

  async function handleJoin() {
    if (!user) {
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }

    setJoining(true);
    setActionError("");
    setJoinedMessage("");

    try {
      await api.joinEvent({
        eventId: id,
        user: { name: user.name, image: user.photoURL },
      });
      setJoined(true);
      setJoinedMessage("You're in! This event is now in your joined events.");
    } catch (requestError) {
      if (requestError.status === 409) {
        setJoined(true);
        setJoinedMessage("You have already joined this event.");
      } else {
        setActionError(requestError.message);
      }
    } finally {
      setJoining(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;

    setDeleting(true);
    setActionError("");

    try {
      await api.deleteEvent(id);
      navigate("/my-events");
    } catch (requestError) {
      setActionError(requestError.message);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <Loader label="Loading event..." />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty">
            <div className="empty-icon">
              <Icon name="alert" size={26} />
            </div>
            <h3>Event not found</h3>
            <p>{error || "This event may have been removed."}</p>
            <div className="empty-action">
              <Link to="/events" className="btn btn-primary">
                Back to events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const creator = isEventCreator(event, user);

  return (
    <div className="page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/events">Events</Link>
          <span>/</span>
          <span>{event.title}</span>
        </nav>

        <div className="detail-hero">
          <div className="detail-media">
            <div className="detail-placeholder">
              <Icon name="sparkles" size={44} />
            </div>
            {event.thumbnail && (
              <img
                src={event.thumbnail}
                alt=""
                onError={(imageError) => {
                  imageError.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          <div className="detail-info">
            <span className="badge static">
              {eventTypeLabel(event.eventType)}
            </span>

            <h1>{event.title}</h1>

            <div className="detail-meta">
              <div className="detail-meta-item">
                <span className="meta-icon">
                  <Icon name="calendar" size={19} />
                </span>
                <div>
                  <span className="label">Date</span>
                  <span className="value">{formatDate(event.eventDate)}</span>
                </div>
              </div>

              <div className="detail-meta-item">
                <span className="meta-icon">
                  <Icon name="pin" size={19} />
                </span>
                <div>
                  <span className="label">Location</span>
                  <span className="value">
                    {event.location || "To be announced"}
                  </span>
                </div>
              </div>

              <div className="detail-meta-item">
                <span className="meta-icon">
                  <Icon name="user" size={19} />
                </span>
                <div>
                  <span className="label">Hosted by</span>
                  <span className="value">{event.creatorEmail}</span>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              {creator ? (
                <>
                  <Link
                    to={`/events/${id}/edit`}
                    className="btn btn-primary"
                  >
                    <Icon name="edit" size={17} />
                    Edit event
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    <Icon name="trash" size={17} />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </>
              ) : user ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleJoin}
                  disabled={joined || joining}
                >
                  {joined ? (
                    <>
                      <Icon name="check" size={17} />
                      You're going
                    </>
                  ) : (
                    <>
                      <Icon name="users" size={17} />
                      {joining ? "Joining..." : "Join this event"}
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: `/events/${id}` }}
                  className="btn btn-primary"
                >
                  <Icon name="lock" size={17} />
                  Log in to join
                </Link>
              )}
            </div>

            {joinedMessage && (
              <div className="alert alert-success">
                <Icon name="check" size={18} />
                <span>{joinedMessage}</span>
              </div>
            )}

            {actionError && (
              <div className="alert alert-error">
                <Icon name="alert" size={18} />
                <span>{actionError}</span>
              </div>
            )}
          </div>
        </div>

        <section className="detail-description-wrap">
          <h2>About this event</h2>
          <p className="detail-description">
            {event.description ||
              "The organizer has not added a description yet. Reach out to them for more details."}
          </p>
        </section>
      </div>
    </div>
  );
}
