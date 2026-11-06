import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import EventForm from "../components/EventForm";
import Icon from "../components/Icon";

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(values) {
    setBusy(true);
    setError("");

    try {
      const data = await api.createEvent({
        ...values,
        creatorEmail: user.email,
      });
      navigate(`/events/${data.insertedId}`);
    } catch (requestError) {
      setError(requestError.message);
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <div className="container form-shell">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              <Icon name="sparkles" size={14} />
              Host an event
            </span>
            <h1>Create an event</h1>
            <p>
              Gather your community around a cause you care about. You can edit
              the details any time.
            </p>
          </div>
        </div>

        <EventForm
          submitLabel="Create event"
          busy={busy}
          serverError={error}
          onSubmit={handleCreate}
          cancelTo="/my-events"
        />
      </div>
    </div>
  );
}
