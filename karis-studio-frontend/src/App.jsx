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
import { useState, useEffect } from "react";
import "./App.css";
import Admin from "./Admin";

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

const timeSlots = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

/* =========================================================
   MY BOOKINGS PAGE
========================================================= */

function MyBookings() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function searchBookings(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setBookings([]);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/my-bookings?phone=${encodeURIComponent(
          phone
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Unable to find bookings."
        );
        return;
      }

      if (!data.bookings || data.bookings.length === 0) {
        setMessage(
          "No bookings found for this phone number."
        );
        return;
      }

      setBookings(data.bookings);
    } catch (error) {
      console.error(
        "Error fetching bookings:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-bookings-page">
      <header className="navbar">
        <a href="/" className="logo">
          KARIS <span>STUDIO</span>
        </a>

        <a href="/" className="text-button">
          Back to Home
          <ArrowRight size={17} />
        </a>
      </header>

      <main className="my-bookings-content">
        <p className="eyebrow">KARIS STUDIO</p>

        <h1>
          My <em>Bookings.</em>
        </h1>

        <p className="my-bookings-description">
          Enter the phone number you used when
          booking your appointment.
        </p>

        <form
          className="my-bookings-form"
          onSubmit={searchBookings}
        >
          <label>
            Phone Number

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="+92 300 1234567"
              required
            />
          </label>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Checking..."
              : "Find My Bookings"}

            <ArrowRight size={18} />
          </button>
        </form>

        {message && (
          <p className="booking-message">
            {message}
          </p>
        )}

        <div className="my-bookings-list">
          {bookings.map((booking) => (
            <div
              className="my-booking-card"
              key={booking.id}
            >
              <div className="my-booking-header">
                <div>
                  <span>
                    Booking #{booking.id}
                  </span>

                  <h3>{booking.service}</h3>
                </div>

                <span
                  className={`booking-status ${booking.status}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="my-booking-details">
                <p>
                  <CalendarDays size={17} />
                  {booking.date}
                </p>

                <p>
                  <Clock3 size={17} />
                  {formatDisplayTime(
                    booking.time
                  )}
                </p>

                <p>
                  <Scissors size={17} />
                  {booking.service}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   TIME FORMATTER
========================================================= */

function formatDisplayTime(timeValue) {
  if (!timeValue) {
    return "";
  }

  const [hour, minute] = timeValue.split(":");

  const hourNumber = Number(hour);

  const period =
    hourNumber >= 12 ? "PM" : "AM";

  const displayHour =
    hourNumber % 12 === 0
      ? 12
      : hourNumber % 12;

  return `${displayHour}:${minute} ${period}`;
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const [selectedService, setSelectedService] =
    useState("");

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");

  const [services, setServices] = useState([]);

  const [bookedSlots, setBookedSlots] =
    useState([]);

  const [loadingSlots, setLoadingSlots] =
    useState(false);

  /* =====================================================
     FETCH SERVICES
  ===================================================== */

  useEffect(() => {
    fetch("http://127.0.0.1:8000/services")
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error(
          "Error fetching services:",
          error
        );
      });
  }, []);

  /* =====================================================
     FETCH BOOKED SLOTS WHEN DATE CHANGES
  ===================================================== */

  useEffect(() => {
    if (!date) {
      setBookedSlots([]);
      setTime("");
      return;
    }

    setLoadingSlots(true);
    setTime("");

    fetch(
      `http://127.0.0.1:8000/booked-slots?date=${date}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch booked slots"
          );
        }

        return response.json();
      })
      .then((data) => {
        setBookedSlots(data.booked_slots);

        console.log(
          "Booked slots for",
          date,
          ":",
          data.booked_slots
        );
      })
      .catch((error) => {
        console.error(
          "Error fetching booked slots:",
          error
        );

        setBookedSlots([]);
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [date]);

  /* =====================================================
     ROUTES
  ===================================================== */

  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  if (
    window.location.pathname === "/my-bookings"
  ) {
    return <MyBookings />;
  }

  /* =====================================================
     OPEN BOOKING
  ===================================================== */

  function openBooking(service = "") {
    setSelectedService(service);

    setName("");
    setPhone("");
    setDate("");
    setTime("");
    setBookedSlots([]);

    setBookingOpen(true);
  }

  /* =====================================================
     CLOSE BOOKING
  ===================================================== */

  function closeBooking() {
    setBookingOpen(false);

    setName("");
    setPhone("");
    setDate("");
    setTime("");
    setBookedSlots([]);
    setLoadingSlots(false);
    setSelectedService("");
  }

  /* =====================================================
     SUBMIT BOOKING
  ===================================================== */

  async function handleBookingSubmit(e) {
    e.preventDefault();

    const bookingData = {
      name: name,
      phone: phone,
      service: selectedService,
      date: date,
      time: time,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();

      console.log(
        "Backend booking response:",
        data
      );

      if (!response.ok) {
        alert(
          data.detail ||
            "This appointment could not be booked."
        );

        return;
      }

      alert(
        "Your appointment request has been submitted successfully!"
      );

      closeBooking();
    } catch (error) {
      console.error(
        "Error submitting booking:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="app">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="navbar">
        <a href="#home" className="logo">
          KARIS <span>STUDIO</span>
        </a>

        <nav
          className={
            menuOpen
              ? "nav-links mobile-open"
              : "nav-links"
          }
        >
          <a
            href="#home"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>

          <a
            href="#services"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </a>

          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>

          <a
            href="#founder"
            onClick={() => setMenuOpen(false)}
          >
            Founder
          </a>

          <a
            href="#team"
            onClick={() => setMenuOpen(false)}
          >
            Our Team
          </a>

          <a
            href="#gallery"
            onClick={() => setMenuOpen(false)}
          >
            Gallery
          </a>

          <a
            href="/my-bookings"
            onClick={() => setMenuOpen(false)}
          >
            My Bookings
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
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          {menuOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>
      </header>

      {/* =================================================
          HERO
      ================================================= */}

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
              A refined beauty destination for those
              who believe self-care should feel
              extraordinary.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() => openBooking()}
              >
                Book an Appointment
                <ArrowRight size={18} />
              </button>

              <a
                href="#services"
                className="text-button"
              >
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
                <strong>
                  Your time. Your ritual.
                </strong>

                <span>
                  Relax · Refresh · Renew
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            MARQUEE
        ================================================= */}

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

        {/* =================================================
            SERVICES
        ================================================= */}

        <section
          className="section services-section"
          id="services"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                OUR SERVICES
              </p>

              <h2>
                Designed around <em>you.</em>
              </h2>
            </div>

            <p>
              From everyday beauty rituals to special
              occasions, every treatment is thoughtfully
              designed to make you feel your best.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <article
                className="service-card"
                key={service.id}
              >
                <div className="service-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <p className="service-category">
                  {service.category}
                </p>

                <h3>{service.title}</h3>

                <p className="service-description">
                  {service.description}
                </p>

                <img
                  src={service.image}
                  alt={service.title}
                  className="service-image"
                />

                <div className="service-bottom">
                  <div>
                    <strong>
                      PKR{" "}
                      {service.price.toLocaleString()}
                    </strong>

                    <span>
                      <Clock3 size={14} />
                      {service.duration} min
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openBooking(
                        service.title
                      )
                    }
                    aria-label={`Book ${service.title}`}
                  >
                    <ArrowRight size={19} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =================================================
            ABOUT
        ================================================= */}

        <section
          className="about-section"
          id="about"
        >
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
              alt="Karis Studio interior"
            />
          </div>

          <div className="about-content">
            <p className="eyebrow">
              THE KARIS EXPERIENCE
            </p>

            <h2>
              Beauty is not just
              <br />
              how you <em>look.</em>
            </h2>

            <p>
              Karis Studio was created around a simple
              idea: beauty appointments should be more
              than appointments.
            </p>

            <p>
              Every detail—from the atmosphere to the
              products we use—is carefully considered so
              you can step away from the noise, slow
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

            <a
              href="#team"
              className="outline-button"
            >
              Meet Our Team
              <ArrowRight size={17} />
            </a>
          </div>
        </section>

        {/* =================================================
            FOUNDER
        ================================================= */}

        <section
          className="founder-section"
          id="founder"
        >
          <div className="founder-image-wrapper">
            <div className="founder-image-frame">
              <img
                src="/images/Confident Salon Founder Portrait.png"
                alt="Wania Adnan - Founder of Karis Studio"
              />
            </div>

            <div className="founder-floating-card">
              <Sparkles size={18} />

              <div>
                <strong>
                  Founded with love
                </strong>

                <span>
                  Karis Studio · 2026
                </span>
              </div>
            </div>
          </div>

          <div className="founder-content">
            <p className="eyebrow">
              MEET THE FOUNDER
            </p>

            <h2>
              Beauty with a
              <br />
              <em>personal touch.</em>
            </h2>

            <p className="founder-intro">
              Karis Studio was born from a simple
              belief: every woman deserves a space
              where she can slow down, feel cared for
              and leave feeling confident.
            </p>

            <p>
              Wania Adnan created Karis Studio to bring
              together beautiful surroundings, thoughtful
              service and talented beauty professionals —
              creating an experience that feels personal
              from the moment you walk through the door.
            </p>

            <div className="founder-signature">
              <strong>Wania Adnan</strong>
              <span>Founder, Karis Studio</span>
            </div>

            <button
              className="outline-button"
              onClick={() => openBooking()}
            >
              Book Your Experience
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        {/* =================================================
            TEAM
        ================================================= */}

        <section
          className="section team-section"
          id="team"
        >
          <div className="center-heading">
            <p className="eyebrow">
              THE PEOPLE BEHIND KARIS
            </p>

            <h2>
              Meet our <em>artists.</em>
            </h2>

            <p>
              Talented professionals who care about the
              details as much as you do.
            </p>
          </div>

          <div className="team-grid">
            {team.map((person) => (
              <article
                className="team-card"
                key={person.name}
              >
                <div className="team-image">
                  <img
                    src={person.image}
                    alt={person.name}
                  />

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

        {/* =================================================
            QUOTE
        ================================================= */}

        <section className="quote-section">
          <div>
            <Sparkles size={24} />

            <blockquote>
              "The best investment you can make is an
              investment in yourself."
            </blockquote>

            <span>— KARIS STUDIO</span>
          </div>
        </section>

        {/* =================================================
            GALLERY
        ================================================= */}

        <section
          className="section gallery-section"
          id="gallery"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                OUR WORLD
              </p>

              <h2>
                A little <em>inspiration.</em>
              </h2>
            </div>

            <a
              href="#contact"
              className="text-button"
            >
              Visit us on Instagram
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <div
                className={`gallery-item gallery-${
                  index + 1
                }`}
                key={image}
              >
                <img
                  src={image}
                  alt={`Karis Studio gallery ${
                    index + 1
                  }`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* =================================================
            REVIEWS
        ================================================= */}

        <section className="reviews-section">
          <div className="center-heading">
            <p className="eyebrow">
              CLIENT LOVE
            </p>

            <h2>
              What they <em>say.</em>
            </h2>
          </div>

          <div className="review-card">
            <div className="stars">
              <Star
                fill="currentColor"
                size={18}
              />
              <Star
                fill="currentColor"
                size={18}
              />
              <Star
                fill="currentColor"
                size={18}
              />
              <Star
                fill="currentColor"
                size={18}
              />
              <Star
                fill="currentColor"
                size={18}
              />
            </div>

            <blockquote>
              "Karis Studio is exactly what a beauty
              experience should be. Beautiful space,
              incredible service and the most relaxing
              manicure I've ever had."
            </blockquote>

            <div className="review-author">
              <div className="author-avatar">
                A
              </div>

              <div>
                <strong>Ayesha R.</strong>
                <span>Verified Client</span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            BOOKING CTA
        ================================================= */}

        <section className="booking-cta">
          <div>
            <p className="eyebrow">
              YOUR NEXT RITUAL
            </p>

            <h2>
              You deserve
              <br />
              some <em>you-time.</em>
            </h2>

            <p>
              Choose your treatment, pick your time and
              let us take care of the rest.
            </p>

            <button
              className="light-button"
              onClick={() => openBooking()}
            >
              Book Your Appointment
              <CalendarDays size={18} />
            </button>
          </div>
        </section>

        {/* =================================================
            CONTACT
        ================================================= */}

        <section
          className="contact-section"
          id="contact"
        >
          <div>
            <p className="eyebrow">
              COME VISIT
            </p>

            <h2>
              Find your way to <em>Karis.</em>
            </h2>
          </div>

          <div className="contact-details">
            <div>
              <MapPin size={21} />

              <div>
                <strong>Studio Address</strong>

                <span>
                  123 Beauty Avenue, islamabad,
                  Pakistan
                </span>
              </div>
            </div>

            <div>
              <Clock3 size={21} />

              <div>
                <strong>Opening Hours</strong>

                <span>
                  Mon – Sun · 10:00 AM – 9:00 PM
                </span>
              </div>
            </div>

            <div>
              <Scissors size={21} />

              <div>
                <strong>Appointments</strong>

                <span>
                  +92 300 1234567
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>
        <div className="footer-main">
          <div>
            <a
              href="#home"
              className="logo footer-logo"
            >
              KARIS <span>STUDIO</span>
            </a>

            <p>
              Where beauty meets confidence.
            </p>
          </div>

          <div className="footer-links">
            <a href="#services">
              Services
            </a>

            <a href="#about">
              About
            </a>

            <a href="#founder">
              Founder
            </a>

            <a href="#team">
              Team
            </a>

            <a href="#gallery">
              Gallery
            </a>

            <a href="/my-bookings">
              My Bookings
            </a>

            <a href="#contact">
              Contact
            </a>
          </div>

          <div className="footer-social">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Karis Studio. All rights reserved.
          </span>

          <span>
            Beauty · Care · Confidence
          </span>
        </div>
      </footer>

      {/* =================================================
          BOOKING MODAL
      ================================================= */}

      {bookingOpen && (
        <div
          className="modal-overlay"
          onClick={closeBooking}
        >
          <div
            className="booking-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={closeBooking}
            >
              <X size={21} />
            </button>

            <p className="eyebrow">
              KARIS STUDIO
            </p>

            <h2>
              Book your <em>appointment.</em>
            </h2>

            <p className="modal-description">
              Choose your preferred service and we'll
              take care of the rest.
            </p>

            <form
              onSubmit={handleBookingSubmit}
            >
              {/* NAME */}

              <label>
                Your Name

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                  required
                />
              </label>

              {/* PHONE */}

              <label>
                Phone Number

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="+92 300 1234567"
                  required
                />
              </label>

              {/* SERVICE */}

              <label>
                Service

                <select
                  value={selectedService}
                  onChange={(e) =>
                    setSelectedService(
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Select a service
                  </option>

                  {services.map((service) => (
                    <option
                      key={service.title}
                      value={service.title}
                    >
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-row">
                {/* DATE */}

                <label>
                  Date

                  <input
                    type="date"
                    value={date}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                    required
                  />
                </label>

                {/* TIME */}

                <label>
                  Time

                  <select
                    value={time}
                    onChange={(e) =>
                      setTime(e.target.value)
                    }
                    required
                    disabled={
                      !date ||
                      loadingSlots
                    }
                  >
                    <option value="">
                      {loadingSlots
                        ? "Checking availability..."
                        : !date
                        ? "Select date first"
                        : "Select a time"}
                    </option>

                    {timeSlots.map((slot) => {
                      const isBooked =
                        bookedSlots.includes(
                          slot
                        );

                      return (
                        <option
                          key={slot}
                          value={slot}
                          disabled={isBooked}
                        >
                          {formatDisplayTime(
                            slot
                          )}

                          {isBooked
                            ? " — Already booked"
                            : " — Available"}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>

              {/* SUBMIT */}

              <button
                className="primary-button submit-button"
                type="submit"
                disabled={
                  loadingSlots || !time
                }
              >
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