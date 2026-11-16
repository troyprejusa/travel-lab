import {
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  Luggage,
  MessageCircle,
  Plane,
  Users,
  Vote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LandingPage({ signedIn }: { signedIn: boolean }) {
  const destination = signedIn ? "/trips" : "/login";
  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="hero-label">
            <Compass size={15} /> YOUR TRAVEL LAB
          </span>
          <h1>
            Good trips start
            <br />
            <span>together.</span>
          </h1>
          <p>
            Bring your people, plans, and possibilities together in one place.
            The adventure starts here.
          </p>
          <div className="landing-actions">
            <Button className="primary-button" asChild>
              <Link to={destination}>
                {signedIn ? "Go to my trips" : "Start planning"}{" "}
                <ArrowRight size={17} />
              </Link>
            </Button>
            <a href="#how-it-works" className="landing-secondary">
              Explore Travel Lab <span>↓</span>
            </a>
          </div>
        </div>
      </section>
      <div className="landing-content" id="how-it-works">
        <div className="landing-section-heading">
          <div>
            <span className="section-kicker">A LITTLE LESS LOGISTICS</span>
            <h2>Everything for the journey</h2>
            <p>
              From the first idea to the final details, keep your trip moving
              together.
            </p>
          </div>
          <span className="landing-heading-note">
            <span /> MADE FOR SHARED ADVENTURES
          </span>
        </div>
        <div className="landing-showcase">
          <div className="preview-card" aria-label="Example trip preview">
            <div className="preview-image">
              <img
                src="/trip-tropical.jpg"
                alt="A mountainous coastline at sunset"
              />
              <span className="preview-badge">EXAMPLE TRIP</span>
              <div className="preview-image-copy">
                <span>
                  <CalendarDays size={14} /> APR 10 – APR 20
                </span>
                <h3>A little time in Maui</h3>
                <p>Good company, great adventures.</p>
              </div>
            </div>
            <div className="preview-footer">
              <div>
                <span className="preview-avatars" aria-hidden="true">
                  <i>T</i>
                  <i>J</i>
                  <i>M</i>
                </span>
                <span>Better with your people</span>
              </div>
              <span className="preview-arrow">
                <ArrowRight size={18} />
              </span>
            </div>
          </div>
          <div className="landing-details">
            <div className="landing-details-heading">
              <span className="section-kicker">THE TRIP TOOLKIT</span>
              <h3>One place for all the plans.</h3>
              <p>
                Less switching between chats and spreadsheets. More looking
                forward to the trip.
              </p>
            </div>
            <div className="tool-list">
              <div>
                <span className="tool-icon lavender">
                  <CalendarDays size={19} />
                </span>
                <span>
                  <strong>Itinerary</strong>
                  <small>Keep the days and details in view</small>
                </span>
                <Check size={16} />
              </div>
              <div>
                <span className="tool-icon peach">
                  <Luggage size={19} />
                </span>
                <span>
                  <strong>Packing</strong>
                  <small>Share the load before you go</small>
                </span>
                <Check size={16} />
              </div>
              <div>
                <span className="tool-icon blush">
                  <Vote size={19} />
                </span>
                <span>
                  <strong>Polls & messages</strong>
                  <small>Make decisions with your crew</small>
                </span>
                <Check size={16} />
              </div>
            </div>
          </div>
        </div>
        <div className="landing-section-heading feature-heading" id="features">
          <div>
            <span className="section-kicker">MADE FOR GOING PLACES</span>
            <h2>Better plans, together.</h2>
            <p>
              Whether it’s a weekend away or the trip of a lifetime, everyone’s
              on the same page.
            </p>
          </div>
        </div>
        <div className="landing-features">
          <article>
            <span className="tool-icon lavender">
              <Plane size={21} />
            </span>
            <h3>Give your trip a home</h3>
            <p>Create a trip and keep the important details easy to find.</p>
          </article>
          <article>
            <span className="tool-icon blush">
              <Users size={21} />
            </span>
            <h3>Bring your people</h3>
            <p>Invite your fellow travelers into the planning process.</p>
          </article>
          <article>
            <span className="tool-icon peach">
              <MessageCircle size={21} />
            </span>
            <h3>Make plans together</h3>
            <p>Share ideas, make decisions, and get ready to go.</p>
          </article>
        </div>
        <section className="landing-cta">
          <div>
            <span className="section-kicker">WHERE TO NEXT?</span>
            <h2>Your next adventure is waiting.</h2>
            <p>Let’s make the planning part a little more fun.</p>
          </div>
          <Button className="primary-button" asChild>
            <Link to={destination}>
              {signedIn ? "Go to my trips" : "Start planning"}{" "}
              <ArrowRight size={17} />
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
