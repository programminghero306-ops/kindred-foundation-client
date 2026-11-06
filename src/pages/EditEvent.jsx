import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import EventForm from "../components/EventForm";
import Icon from "../components/Icon";
import Loader from "../components/Loader";
import { isEventCreator } from "../utils";

export default function EditEvent() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .getEvent(id)
      .then((data) => {
        if (active) setEvent(data);
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
  }, [id]);

  async function handleUpdate(values) {
    setBusy(true);
    setError("");

    try {
      await api.updateEvent(id, values);
      navigate(`/events/${id}`);
    } catch (requestError) {
      setError(requestError.message);
      setBusy(false);
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

  if (!event) {
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
              <Link to="/my-events" className="btn btn-primary">
                Back to my events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isEventCreator(event, user)) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty">
            <div className="empty-icon">
              <Icon name="lock" size={26} />
            </div>
            <h3>You can only edit your own events</h3>
            <p>This event belongs to another host.</p>
            <div className="empty-action">
              <Link to="/my-events" className="btn btn-primary">
                Go to my events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container form-shell">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <Icon name="edit" size={14} />
              Edit event
            </span>
            <h1>Update your event</h1>
            <p>Keep the details accurate so volunteers know what to expect.</p>
          </div>
        </div>

        <EventForm
          initialValues={event}
          submitLabel="Save changes"
          busy={busy}
          serverError={error}
          onSubmit={handleUpdate}
          cancelTo={`/events/${id}`}
        />
      </div>
    </div>
  );
}
