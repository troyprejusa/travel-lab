import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useTripAdmin } from "@/hooks/useTripAdmin";
export default function TripSettingsPage() {
  const { tripId = "" } = useParams();
  const admin = useTripAdmin();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  async function remove(del: boolean) {
    if (
      !window.confirm(
        del ? "Delete this trip for everyone?" : "Leave this trip?",
      )
    )
      return;
    try {
      const r = await apiFetch(
        del
          ? `/trip/${encodeURIComponent(tripId)}`
          : `/user/trips/${encodeURIComponent(tripId)}`,
        { method: "DELETE" },
      );
      if (!r.ok) throw new Error(`Request failed (HTTP ${r.status}).`);
      navigate("/trips");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    }
  }
  return (
    <main className="workspace">
      <div className="page-heading">
        <div>
          <span className="section-kicker">TRIP DETAILS</span>
          <h1>Trip settings</h1>
          <p>Manage your place in this trip.</p>
        </div>
      </div>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <div className="resource-card settings-action">
        <h2>Leave trip</h2>
        <p>Remove yourself from this trip.</p>
        <Button variant="outline" onClick={() => void remove(false)}>
          Leave trip
        </Button>
      </div>
      {admin && (
        <div className="resource-card settings-action danger-card">
          <h2>Delete trip</h2>
          <p>Permanently delete the trip for everyone.</p>
          <Button
            className="danger-button"
            variant="outline"
            onClick={() => void remove(true)}
          >
            Delete trip
          </Button>
        </div>
      )}
    </main>
  );
}
