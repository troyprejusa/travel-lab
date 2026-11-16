import {
  CalendarDays,
  Compass,
  LayoutDashboard,
  LogOut,
  Luggage,
  MessageCircle,
  Plane,
  Settings,
  Vote,
} from "lucide-react";
import { Link, NavLink, useMatch } from "react-router-dom";

const sections = [
  ["", "Overview", LayoutDashboard],
  ["itinerary", "Itinerary", CalendarDays],
  ["packing", "Packing", Luggage],
  ["polls", "Polls", Vote],
  ["messages", "Messages", MessageCircle],
  ["settings", "Trip settings", Settings],
] as const;
export default function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  const match = useMatch("/trips/:tripId/*");
  const root = match?.params.tripId
    ? `/trips/${encodeURIComponent(match.params.tripId)}`
    : null;
  return (
    <aside className="app-sidebar">
      <Link to="/trips" className="brand sidebar-brand">
        <img src="/logo.png" alt="" />
        <span>Travel Lab</span>
      </Link>
      <nav className="sidebar-nav" aria-label="Application navigation">
        <span className="sidebar-label">EXPLORE</span>
        <NavLink to="/trips" end>
          <Plane size={19} /> My trips
        </NavLink>
        {root && (
          <>
            <span className="sidebar-label">THIS TRIP</span>
            {sections.map(([path, label, Icon]) => (
              <NavLink key={label} to={path ? `${root}/${path}` : root} end>
                <Icon size={19} />
                {label}
              </NavLink>
            ))}
          </>
        )}
        <span className="sidebar-label">YOUR ACCOUNT</span>
        <NavLink to="/settings">
          <Settings size={19} /> Settings
        </NavLink>
        <Link to="/">
          <Compass size={19} /> Home
        </Link>
      </nav>
      <button className="sidebar-signout" onClick={onSignOut}>
        <LogOut size={18} /> Sign out
      </button>
    </aside>
  );
}
