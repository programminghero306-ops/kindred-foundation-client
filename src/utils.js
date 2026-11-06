export const EVENT_TYPES = [
  { value: "cleanup", label: "Cleanup" },
  { value: "tree-planting", label: "Tree planting" },
  { value: "food-drive", label: "Food drive" },
  { value: "education", label: "Education" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "health", label: "Health" },
  { value: "community", label: "Community" },
  { value: "other", label: "Other" },
];

export function eventTypeLabel(value) {
  if (!value) return "Event";
  const match = EVENT_TYPES.find((type) => type.value === value);
  if (match) return match.label;

  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatDate(value) {
  if (!value) return "Date to be announced";

  let date;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatMonthDay(value) {
  if (!value) return { day: "--", month: "---" };

  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(
          Number(value.slice(0, 4)),
          Number(value.slice(5, 7)) - 1,
          Number(value.slice(8, 10))
        )
      : new Date(value);

  if (Number.isNaN(date.getTime())) return { day: "--", month: "---" };

  return {
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("en-US", { month: "short" })
      .format(date)
      .toUpperCase(),
  };
}

export function toDateInput(value) {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function truncate(text, max = 120) {
  if (!text) return "";
  const value = String(text).trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}...`;
}

export function initials(name) {
  if (!name) return "K";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function isEventCreator(event, user) {
  if (!event || !user?.email || !event.creatorEmail) return false;
  return (
    String(event.creatorEmail).trim().toLowerCase() ===
    String(user.email).trim().toLowerCase()
  );
}

export function normalizeJoinedEvent(item) {
  const event = item.event || item;
  return {
    ...event,
    _id: event._id || item.eventId,
    eventId: item.eventId || event._id,
    joinedAt: item.joinedAt,
  };
}
