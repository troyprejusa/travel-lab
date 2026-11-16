import { useEffect, useState, type FormEvent } from "react";
import { auth } from "@/auth/auth";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
type User = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
};
export default function AccountSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const email = auth.getToken();
    if (!email) return;
    let active = true;
    apiFetch(`/user/${encodeURIComponent(email)}`, { method: "POST" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Unable to load account.");
        return r.json();
      })
      .then((data) => {
        if (active) setUser(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (!user) return;
    try {
      const r = await apiFetch(`/user/${encodeURIComponent(user.email)}`, {
        method: "PATCH",
        body: new FormData(e.currentTarget),
      });
      if (!r.ok) throw new Error(`Unable to save (HTTP ${r.status}).`);
      setUser(await r.json());
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save.");
    }
  }
  return (
    <main className="workspace">
      <div className="page-heading">
        <div>
          <span className="section-kicker">YOUR ACCOUNT</span>
          <h1>Account settings</h1>
          <p>Update the contact details your fellow travellers can see.</p>
        </div>
      </div>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {saved && <p role="status">Changes saved.</p>}
      {user && (
        <form className="form-card" onSubmit={save}>
          <p>{user.email}</p>
          <label>
            First name
            <input
              name="first_name"
              defaultValue={user.first_name || ""}
              required
            />
          </label>
          <label>
            Last name
            <input
              name="last_name"
              defaultValue={user.last_name || ""}
              required
            />
          </label>
          <label>
            Phone
            <input
              name="phone"
              type="tel"
              defaultValue={user.phone || ""}
              required
            />
          </label>
          <Button>Save changes</Button>
        </form>
      )}
    </main>
  );
}
