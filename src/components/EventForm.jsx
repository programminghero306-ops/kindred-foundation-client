import { useState } from "react";
import { Link } from "react-router-dom";
import { EVENT_TYPES, toDateInput } from "../utils";
import Icon from "./Icon";

const EMPTY_EVENT = {
  title: "",
  description: "",
  eventType: "cleanup",
  thumbnail: "",
  location: "",
  eventDate: "",
};

export default function EventForm({
  initialValues,
  submitLabel = "Save event",
  busy = false,
  serverError = "",
  onSubmit,
  cancelTo = "/events",
}) {
  const [values, setValues] = useState({
    ...EMPTY_EVENT,
    ...initialValues,
    eventType: initialValues?.eventType || EMPTY_EVENT.eventType,
    eventDate: toDateInput(initialValues?.eventDate),
  });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  }

  function validate() {
    const nextErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = "Please add an event title.";
    }
    if (!values.eventType) {
      nextErrors.eventType = "Choose an event type.";
    }
    if (!values.eventDate) {
      nextErrors.eventDate = "Choose a date for the event.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      eventType: values.eventType,
      thumbnail: values.thumbnail.trim(),
      location: values.location.trim(),
      eventDate: values.eventDate,
    });
  }

  return (
    <form className="card event-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="alert alert-error">
          <Icon name="alert" size={18} />
          <span>{serverError}</span>
        </div>
      )}

      <div className="form-grid">
        <div className="form-field full">
          <label htmlFor="title">Event title</label>
          <input
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Community park cleanup"
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="eventType">Event type</label>
          <select
            id="eventType"
            name="eventType"
            value={values.eventType}
            onChange={handleChange}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.eventType && (
            <span className="form-error">{errors.eventType}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="eventDate">Date</label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            value={values.eventDate}
            onChange={handleChange}
          />
          {errors.eventDate && (
            <span className="form-error">{errors.eventDate}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            value={values.location}
            onChange={handleChange}
            placeholder="Central Park, main entrance"
          />
        </div>

        <div className="form-field">
          <label htmlFor="thumbnail">Thumbnail URL</label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="url"
            value={values.thumbnail}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />
          <span className="form-hint">
            Optional. Paste a link to an image for the event card.
          </span>
        </div>

        {values.thumbnail && (
          <div className="form-field full">
            <span className="form-hint">Thumbnail preview</span>
            <div className="thumb-preview">
              <img
                key={values.thumbnail}
                src={values.thumbnail}
                alt="Event thumbnail preview"
                onError={(error) => {
                  error.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        <div className="form-field full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="What will volunteers do? Who is this event for? What should people bring?"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Saving..." : submitLabel}
        </button>
        <Link to={cancelTo} className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
