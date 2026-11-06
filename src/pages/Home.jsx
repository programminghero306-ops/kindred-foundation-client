import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import EmptyState from "../components/EmptyState";
import EventCard from "../components/EventCard";
import Icon from "../components/Icon";
import Loader from "../components/Loader";

export default function Home() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationAmount, setDonationAmount] = useState("500");
  const [donationMessage, setDonationMessage] = useState("");

  function handleDonation(event) {
    event.preventDefault();
    const amount = Number(donationAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setDonationMessage("Please enter a valid donation amount.");
      return;
    }
    setDonationMessage(`Thank you for pledging ৳${amount.toLocaleString()}. We will contact you with secure payment details.`);
  }

  useEffect(() => {
    let active = true;

    api
      .getEvents(6)
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

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <Icon name="sparkles" size={14} />
              Community-powered giving
            </span>

            <h1>
              Good things happen when we <span>show up together.</span>
            </h1>

            <p>
              Kindred Foundation connects volunteers with local events that
              make neighborhoods stronger. Find a cause, bring a friend, and
              make a day of it.
            </p>

            <div className="hero-actions">
              <Link to="/events" className="btn btn-primary btn-lg">
                Explore events
                <Icon name="arrow" size={18} />
              </Link>
              {user ? (
                <Link to="/create-event" className="btn btn-outline btn-lg">
                  <Icon name="plus" size={18} />
                  Create an event
                </Link>
              ) : (
                <Link to="/register" className="btn btn-outline btn-lg">
                  Join the community
                </Link>
              )}
            </div>

            <div className="hero-points">
              <span>
                <Icon name="check" size={15} />
                Free to join
              </span>
              <span>
                <Icon name="check" size={15} />
                Local impact
              </span>
              <span>
                <Icon name="check" size={15} />
                Open to everyone
              </span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-panel">
              <div className="hero-panel-head">
                <span className="pill-light">This week</span>
                <Icon name="sparkles" size={18} />
              </div>

              <div className="hero-mini">
                <div className="mini-date">
                  <strong>12</strong>
                  <span>DEC</span>
                </div>
                <div className="mini-info">
                  <strong>Community cleanup</strong>
                  <span>Central Park · 9:00 AM</span>
                </div>
              </div>

              <div className="hero-mini">
                <div className="mini-date alt">
                  <strong>18</strong>
                  <span>DEC</span>
                </div>
                <div className="mini-info">
                  <strong>Toy drive</strong>
                  <span>Kindred Hall · 11:00 AM</span>
                </div>
              </div>

              <div className="hero-mini">
                <div className="mini-date warm">
                  <strong>21</strong>
                  <span>DEC</span>
                </div>
                <div className="mini-info">
                  <strong>Tree planting</strong>
                  <span>Riverside trail · 8:30 AM</span>
                </div>
              </div>

              <div className="hero-panel-foot">
                <Icon name="users" size={16} />
                240+ neighbors already involved
              </div>
            </div>

            <div className="hero-float hero-float-1">
              <Icon name="heart" size={16} />
              Free to join
            </div>
            <div className="hero-float hero-float-2">
              <Icon name="calendar" size={16} />
              New events weekly
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Upcoming events</h2>
              <p>Find a cause, bring a friend, and make a day of it.</p>
            </div>
            <Link to="/events" className="text-link">
              View all events
              <Icon name="arrow" size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader label="Loading upcoming events..." />
          ) : error ? (
            <div className="alert alert-error">
              <Icon name="alert" size={18} />
              <span>{error}</span>
            </div>
          ) : events.length === 0 ? (
            <EmptyState
              title="No upcoming events yet"
              message="Be the first to bring people together around a cause you care about."
              action={
                <Link
                  to={user ? "/create-event" : "/register"}
                  className="btn btn-primary"
                >
                  <Icon name="plus" size={17} />
                  Create the first event
                </Link>
              }
            />
          ) : (
            <div className="event-grid">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section how-section">
        <div className="container">
          <div className="section-head center">
            <div>
              <h2>How it works</h2>
              <p>Three simple steps from curiosity to impact.</p>
            </div>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Find your people</h3>
              <p>
                Browse upcoming events near you and pick a cause that speaks to
                you. Every event is open to everyone.
              </p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Join in one click</h3>
              <p>
                Create an account, join an event, and keep all your plans in one
                place under your joined events.
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Show up and help</h3>
              <p>
                Bring your energy, meet your neighbors, and leave knowing you
                made your community a little stronger.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section support-section">
        <div className="container support-grid">
          <div className="volunteer-area">
            <span className="eyebrow">
              <Icon name="users" size={14} />
              Volunteer with us
            </span>
            <h2>Give your time. Change a life.</h2>
            <p>
              Join a community team and help turn local ideas into lasting
              impact. Choose a role that fits your skills and availability.
            </p>

            <div className="volunteer-options">
              <div className="volunteer-option">
                <span className="volunteer-icon">
                  <Icon name="calendar" size={20} />
                </span>
                <div>
                  <h3>Event volunteer</h3>
                  <p>Help organize, welcome guests, and support activities.</p>
                </div>
              </div>
              <div className="volunteer-option">
                <span className="volunteer-icon">
                  <Icon name="heart" size={20} />
                </span>
                <div>
                  <h3>Community supporter</h3>
                  <p>Spread awareness and help local causes reach more people.</p>
                </div>
              </div>
            </div>

            <Link to="/events" className="btn btn-primary">
              Find a volunteer opportunity
              <Icon name="arrow" size={17} />
            </Link>
          </div>

          <form className="donation-card" onSubmit={handleDonation}>
            <span className="donation-icon" aria-hidden="true">
              <Icon name="heart" size={22} />
            </span>
            <span className="donation-label">Make a donation</span>
            <h2>Every gift creates an opportunity.</h2>
            <p>Your contribution helps events, supplies, and community projects reach those who need them.</p>

            <div className="donation-amounts" aria-label="Choose donation amount">
              {[250, 500, 1000, 2500].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={donationAmount === String(amount) ? "donation-amount active" : "donation-amount"}
                  onClick={() => {
                    setDonationAmount(String(amount));
                    setDonationMessage("");
                  }}
                >
                  ৳{amount.toLocaleString()}
                </button>
              ))}
            </div>

            <label className="donation-custom">
              <span>Custom amount</span>
              <div>
                <b>৳</b>
                <input
                  type="number"
                  min="1"
                  value={donationAmount}
                  onChange={(event) => {
                    setDonationAmount(event.target.value);
                    setDonationMessage("");
                  }}
                  aria-label="Custom donation amount"
                />
              </div>
            </label>

            <button type="submit" className="btn btn-primary btn-block">
              Pledge donation
              <Icon name="heart" size={17} />
            </button>
            {donationMessage && (
              <p className="donation-message" role="status">
                <Icon name="check" size={16} />
                {donationMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div>
              <h2>Have a cause worth gathering for?</h2>
              <p>
                Create an event and invite your community to show up for it.
              </p>
            </div>
            <Link
              to={user ? "/create-event" : "/register"}
              className="btn btn-lg"
            >
              {user ? "Create an event" : "Get started"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
