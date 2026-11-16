import TravellersSection from "@/components/layout/TravellersSection";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Luggage,
  MessageCircle,
  Vote,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
function formatDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}
type Trip = {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  description: string | null;
  vacation_type: string;
};
export default function TripOverviewPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    apiFetch("/user/trips")
      .then(async (r) => {
        if (!r.ok) throw new Error("Unable to load trip.");
        return r.json();
      })
      .then((trips: Trip[]) => {
        if (active) setTrip(trips.find((t) => t.id === tripId) || null);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tripId]);
  return (
    <main className="workspace">
      {loading ? (
        <p>Loading trip…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : !trip ? (
        <p>Trip not found or unavailable.</p>
      ) : (
        <>
          <div
            className="trip-hero"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(18,25,40,.76), rgba(18,25,40,.1)), url(/trip-${["tropical", "wilderness", "city", "historical", "countryside", "road_trip", "winter"].includes(trip.vacation_type) ? trip.vacation_type : "tropical"}.jpg)`,
            }}
          >
            <span>YOUR TRIP · {trip.vacation_type.replace("_", " ")}</span>
            <h1>{trip.destination}</h1>
            <p>
              {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
            </p>
          </div>
          <div className="overview-intro">
            <div>
              <span className="section-kicker">MAKE THE MOST OF IT</span>
              <h2>Your trip, all in one place</h2>
              <p>Pick up where you left off and plan the details together.</p>
            </div>
          </div>
          <div className="overview-shortcuts">
            {(
              [
                ["itinerary", "Itinerary", "See the plan", CalendarDays],
                ["packing", "Packing", "Share the essentials", Luggage],
                ["polls", "Polls", "Decide together", Vote],
                ["messages", "Messages", "Chat with your group", MessageCircle],
              ] as const
            ).map(([path, title, subtitle, Icon]) => (
              <Link key={path} to={path} className="shortcut-card">
                <span className="shortcut-icon">
                  <Icon size={20} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{subtitle}</small>
                </span>
                <ArrowRight className="shortcut-arrow" size={17} />
              </Link>
            ))}
          </div>
          <div className="resource-card trip-about">
            <span className="section-kicker">THE DETAILS</span>
            <h2>About this trip</h2>
            <p>{trip.description || "No description yet."}</p>
            <p>
              Trip ID: <code className="trip-id">{trip.id}</code>
            </p>
          </div>
          <TravellersSection />
        </>
      )}
    </main>
  );
}
