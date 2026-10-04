import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  Menu,
  Scissors,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";
import "./App.css";

const services = [
  {
    category: "Nails",
    title: "Signature Manicure",
    description:
      "A complete nail care ritual with shaping, cuticle care, massage and your choice of finish.",
    price: "PKR 3,500",
    duration: "60 min",
  },
  {
    category: "Nails",
    title: "Luxury Pedicure",
    description:
      "Relax, refresh and restore with exfoliation, nourishing treatment and a beautiful finish.",
    price: "PKR 4,000",
    duration: "75 min",
  },
  {
    category: "Hair",
    title: "Signature Haircut",
    description:
      "A personalized cut and styling session designed around your look and lifestyle.",
    price: "PKR 4,500",
    duration: "60 min",
  },
  {
    category: "Skin",
    title: "Glow Facial",
    description:
      "Deep cleansing, gentle exfoliation and hydration for fresh, luminous-looking skin.",
    price: "PKR 5,500",
    duration: "75 min",
  },
  {
    category: "Makeup",
    title: "Event Makeup",
    description:
      "Elegant professional makeup tailored to your event, outfit and personal style.",
    price: "PKR 8,000",
    duration: "90 min",
  },
  {
    category: "Beauty",
    title: "Relaxation Massage",
    description:
      "A calming treatment designed to help you slow down, release tension and reset.",
    price: "PKR 6,000",
    duration: "60 min",
  },
];

const team = [
  {
    name: "Sarah Khan",
    role: "Senior Nail Artist",
    image:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Maya Ali",
    role: "Hair Stylist",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Ayesha Noor",
    role: "Makeup Artist",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=80",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openBooking = (service = "") => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <a href="#home" className="logo">
          KARIS <span>STUDIO</span>
        </a>

        <nav className={menuOpen ? "nav-links mobile-open" : "nav-links"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#team" onClick={() => setMenuOpen(false)}>
            Our Team
          </a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>
            Gallery
          </a>
          <button
            className="nav-book"
            onClick={() => {
              setMenuOpen(false);
              openBooking();
            }}
          >
            Book Now
          </button>
        </nav>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </header>

      {/* HERO */}
      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">
              <Sparkles size={15} />
              best BEAUTY EXPERIENCE
            </p>

            <h1>
              Where beauty
              <br />
              meets <em>confidence.</em>
            </h1>

            <p className="hero-description">
              A refined beauty destination for those who believe self-care
              should feel extraordinary.
            </p>

            <div className="hero-buttons">
              <button className="primary-button" onClick={() => openBooking()}>
                Book an Appointment
                <ArrowRight size={18} />
              </button>

              <a href="#services" className="text-button">
                Explore Services
                <ChevronRight size={17} />
              </a>
            </div>

            <div className="hero-info">
              <div>
                <strong>10+</strong>
                <span>Years of expertise</span>
              </div>
              <div>
                <strong>5K+</strong>
                <span>Happy clients</span>
              </div>
              <div>
                <strong>4.9</strong>
                <span>Client rating</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85"
              alt="Luxury salon"
            />
            <div className="hero-image-card">
              <Sparkles size={19} />
              <div>
                <strong>Your time. Your ritual.</strong>
                <span>Relax · Refresh · Renew</span>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee">
          <span>MANICURE</span>
          <i>✦</i>
          <span>PEDICURE</span>
          <i>✦</i>
          <span>HAIR</span>
          <i>✦</i>
          <span>FACIAL</span>
          <i>✦</i>
          <span>MAKEUP</span>
          <i>✦</i>
          <span>WELLNESS</span>
        </div>

        {/* SERVICES */}
        <section className="section services-section" id="services">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR SERVICES</p>
              <h2>Designed around <em>you.</em></h2>
            </div>
            <p>
              From everyday beauty rituals to special occasions, every
              treatment is thoughtfully designed to make you feel your best.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <div className="service-number">
                  0{index + 1}
                </div>

                <p className="service-category">{service.category}</p>

                <h3>{service.title}</h3>

                <p className="service-description">
                  {service.description}
                </p>

                <div className="service-bottom">
                  <div>
                    <strong>{service.price}</strong>
                    <span>
                      <Clock3 size={14} />
                      {service.duration}
                    </span>
                  </div>

                  <button onClick={() => openBooking(service.title)}>
                    <ArrowRight size={19} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-section" id="about">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
              alt="Karis Studio interior"
            />
          </div>

          <div className="about-content">
            <p className="eyebrow">THE KARIS EXPERIENCE</p>

            <h2>
              Beauty is not just
              <br />
              how you <em>look.</em>
            </h2>

            <p>
              Karis Studio was created around a simple idea: beauty
              appointments should be more than appointments.
            </p>

            <p>
              Every detail—from the atmosphere to the products we use—is
              carefully considered so you can step away from the noise, slow
              down and leave feeling renewed.
            </p>

            <ul>
              <li>
                <Check size={18} />
                Premium products
              </li>
              <li>
                <Check size={18} />
                Experienced professionals
              </li>
              <li>
                <Check size={18} />
                Personalized treatments
              </li>
            </ul>

            <a href="#team" className="outline-button">
              Meet Our Team
              <ArrowRight size={17} />
            </a>
          </div>
        </section>

        {/* TEAM */}
        <section className="section team-section" id="team">
          <div className="center-heading">
            <p className="eyebrow">THE PEOPLE BEHIND KARIS</p>
            <h2>Meet our <em>artists.</em></h2>
            <p>
              Talented professionals who care about the details as much as
              you do.
            </p>
          </div>

          <div className="team-grid">
            {team.map((person) => (
              <article className="team-card" key={person.name}>
                <div className="team-image">
                  <img src={person.image} alt={person.name} />
                  <div className="team-social">
                    <Sparkles size={17} />
                  </div>
                </div>
                <p>{person.role}</p>
                <h3>{person.name}</h3>
              </article>
            ))}
          </div>
        </section>

        {/* QUOTE */}
        <section className="quote-section">
          <div>
            <Sparkles size={24} />
            <blockquote>
              "The best investment you can make is an investment in
              yourself."
            </blockquote>
            <span>— KARIS STUDIO</span>
          </div>
        </section>

        {/* GALLERY */}
        <section className="section gallery-section" id="gallery">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR WORLD</p>
              <h2>A little <em>inspiration.</em></h2>
            </div>

            <a href="#contact" className="text-button">
              Visit us on Instagram
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <div className={`gallery-item gallery-${index + 1}`} key={image}>
                <img src={image} alt={`Karis Studio gallery ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section className="reviews-section">
          <div className="center-heading">
            <p className="eyebrow">CLIENT LOVE</p>
            <h2>What they <em>say.</em></h2>
          </div>

          <div className="review-card">
            <div className="stars">
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
            </div>

            <blockquote>
              "Karis Studio is exactly what a beauty experience should be.
              Beautiful space, incredible service and the most relaxing
              manicure I've ever had."
            </blockquote>

            <div className="review-author">
              <div className="author-avatar">A</div>
              <div>
                <strong>Ayesha R.</strong>
                <span>Verified Client</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOOKING CTA */}
        <section className="booking-cta">
          <div>
            <p className="eyebrow">YOUR NEXT RITUAL</p>
            <h2>
              You deserve
              <br />
              some <em>you-time.</em>
            </h2>
            <p>
              Choose your treatment, pick your time and let us take care of
              the rest.
            </p>

            <button className="light-button" onClick={() => openBooking()}>
              Book Your Appointment
              <CalendarDays size={18} />
            </button>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact-section" id="contact">
          <div>
            <p className="eyebrow">COME VISIT</p>
            <h2>Find your way to <em>Karis.</em></h2>
          </div>

          <div className="contact-details">
            <div>
              <MapPin size={21} />
              <div>
                <strong>Studio Address</strong>
                <span>123 Beauty Avenue, islamabad, Pakistan</span>
              </div>
            </div>

            <div>
              <Clock3 size={21} />
              <div>
                <strong>Opening Hours</strong>
                <span>Mon – Sun · 10:00 AM – 9:00 PM</span>
              </div>
            </div>

            <div>
              <Scissors size={21} />
              <div>
                <strong>Appointments</strong>
                <span>+92 300 1234567</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-main">
          <div>
            <a href="#home" className="logo footer-logo">
              KARIS <span>STUDIO</span>
            </a>
            <p>Where beauty meets confidence.</p>
          </div>

          <div className="footer-links">
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#team">Team</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-social">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Karis Studio. All rights reserved.</span>
          <span>Beauty · Care · Confidence</span>
        </div>
      </footer>

      {/* BOOKING MODAL */}
      {bookingOpen && (
        <div className="modal-overlay" onClick={() => setBookingOpen(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setBookingOpen(false)}
            >
              <X size={21} />
            </button>

            <p className="eyebrow">KARIS STUDIO</p>
            <h2>Book your <em>appointment.</em></h2>
            <p className="modal-description">
              Choose your preferred service and we'll take care of the rest.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Booking request received!");
                setBookingOpen(false);
              }}
            >
              <label>
                Your Name
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  required
                />
              </label>

              <label>
                Service
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.title} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-row">
                <label>
                  Date
                  <input type="date" required />
                </label>

                <label>
                  Time
                  <input type="time" required />
                </label>
              </div>

              <button className="primary-button submit-button" type="submit">
                Request Appointment
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;