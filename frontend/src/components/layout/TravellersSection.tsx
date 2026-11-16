import { useTripAdmin } from "@/hooks/useTripAdmin";
import { Button } from "@/components/ui/button";
import { ResourceState } from "@/components/layout/ResourceState";
import { useTripResource } from "@/hooks/useTripResource";
import { apiFetch } from "@/lib/api";
import { Mail, Phone, Users } from "lucide-react";

type Traveller = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  confirmed: boolean;
  admin: boolean;
};
export default function TravellersSection() {
  const admin = useTripAdmin();
  const { tripId, data, loading, error, reload, setError } =
    useTripResource<Traveller>("travellers");
  async function manage(id: string, method: string) {
    try {
      const response = await apiFetch(
        `/user/trips/${encodeURIComponent(tripId)}/${encodeURIComponent(id)}`,
        { method },
      );
      if (!response.ok)
        throw new Error(`Request failed (HTTP ${response.status}).`);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    }
  }
  const confirmed = data.filter((person) => person.confirmed).length;
  return (
    <section className="travellers-section">
      <div className="people-heading">
        <div>
          <span className="section-kicker">BETTER TOGETHER</span>
          <h2>
            The travel crew <span className="crew-count">{confirmed}</span>
          </h2>
          <p>The people making this trip happen.</p>
        </div>
        <div className="crew-invite">
          <Users size={17} />
          <span>Share the trip ID above to invite your people.</span>
        </div>
      </div>
      <ResourceState loading={loading} error={error} />
      <div className="people-grid">
        {data.map((person, index) => {
          const name =
            [person.first_name, person.last_name].filter(Boolean).join(" ") ||
            person.email;
          const initials =
            [person.first_name?.[0], person.last_name?.[0]]
              .filter(Boolean)
              .join("") || person.email[0];
          return (
            <article className="person-card" key={person.id}>
              <div className="person-top">
                <div
                  className={`person-avatar avatar-${index % 4}`}
                  aria-hidden="true"
                >
                  {initials.toUpperCase()}
                </div>
                <span
                  className={`person-role ${!person.confirmed ? "pending" : ""}`}
                >
                  {person.confirmed
                    ? person.admin
                      ? "Trip admin"
                      : "Traveller"
                    : "Request pending"}
                </span>
              </div>
              <h3>{name}</h3>
              <div className="person-contact">
                <span>
                  <Mail size={14} />
                  {person.email}
                </span>
                {person.phone && (
                  <span>
                    <Phone size={14} />
                    {person.phone}
                  </span>
                )}
              </div>
              {admin && (
                <div className="person-actions">
                  {!person.confirmed && (
                    <Button
                      size="sm"
                      onClick={() => void manage(person.id, "PATCH")}
                    >
                      Accept request
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (
                        window.confirm(`Remove ${person.email} from this trip?`)
                      )
                        void manage(person.id, "DELETE");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {!loading && !error && !data.length && (
        <p className="empty-state">No travellers found.</p>
      )}
    </section>
  );
}
