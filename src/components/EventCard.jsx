import { Link } from "react-router-dom";
import { eventTypeLabel, formatDate, truncate } from "../utils";
import Icon from "./Icon";

export default function EventCard({ event, actions }) {
  const id = event._id || event.eventId;
  const title = event.title || "Untitled event";

  return (
    <article className="event-card">
      <Link to={`/events/${id}`} className="event-card-media">
        <div className="event-card-placeholder">
          <Icon name="sparkles" size={30} />
        </div>
        {event.thumbnail && (
          <img
            className="event-cover"
            src={event.thumbnail}
            alt=""
            loading="lazy"
            onError={(error) => {
              error.currentTarget.style.display = "none";
            }}
          />
        )}
        <span className="badge">{eventTypeLabel(event.eventType)}</span>
      </Link>

      <div className="event-card-body">
        <div className="event-meta">
          <span>
            <Icon name="calendar" size={15} />
            {formatDate(event.eventDate)}
          </span>
          {event.location && (
            <span>
              <Icon name="pin" size={15} />
              {event.location}
            </span>
          )}
        </div>

        <h3>
          <Link to={`/events/${id}`}>{title}</Link>
        </h3>

        <p>
          {truncate(
            event.description ||
              "Join neighbors for a day of giving back and building connection."
          )}
        </p>

        {actions ? (
          <div className="card-actions">{actions}</div>
        ) : (
          <Link to={`/events/${id}`} className="text-link">
            View details
            <Icon name="arrow" size={16} />
          </Link>
        )}
      </div>
    </article>
  );
}
