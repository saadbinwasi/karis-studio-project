import { useEffect, useState } from "react";
import "./admin.css";
function AdminDashboard() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        getBookings();
    }, []);

    async function getBookings() {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/bookings"
            );

            const data = await response.json();

            setBookings(data.bookings);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    }

    return (
        <div className="admin-page">

            {/* Header */}
            <header className="admin-header">
                <div>
                    <p className="admin-small-title">KARIS STUDIO</p>
                    <h1>Admin Dashboard</h1>
                </div>

                <button className="logout-button">
                    Logout
                </button>
            </header>


            {/* Welcome Section */}
            <section className="welcome-section">
                <div>
                    <h2>Welcome back, Admin ✨</h2>
                    <p>
                        Manage your salon bookings from one place.
                    </p>
                </div>
            </section>


            {/* Statistics */}
            <section className="stats-container">

                <div className="stat-card">
                    <div className="stat-icon">📅</div>

                    <div>
                        <p>Total Bookings</p>
                        <h2>{bookings.length}</h2>
                    </div>
                </div>


                <div className="stat-card">
                    <div className="stat-icon">💅</div>

                    <div>
                        <p>Services Booked</p>
                        <h2>{bookings.length}</h2>
                    </div>
                </div>


                <div className="stat-card">
                    <div className="stat-icon">👥</div>

                    <div>
                        <p>Customers</p>
                        <h2>{bookings.length}</h2>
                    </div>
                </div>

            </section>


            {/* Bookings */}
            <section className="bookings-section">

                <div className="section-header">
                    <div>
                        <p className="section-label">BOOKINGS</p>
                        <h2>All Appointments</h2>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={getBookings}
                    >
                        ↻ Refresh
                    </button>
                </div>


                {/* Desktop Table */}
                <div className="table-wrapper">

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>


                        <tbody>

                            {bookings.map((booking) => (

                                <tr key={booking.id}>

                                    <td>
                                        <span className="booking-id">
                                            #{booking.id}
                                        </span>
                                    </td>


                                    <td>
                                        <div className="customer-info">

                                            <div className="customer-avatar">
                                                {booking.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <strong>
                                                {booking.name}
                                            </strong>

                                        </div>
                                    </td>


                                    <td>
                                        {booking.phone}
                                    </td>


                                    <td>
                                        <span className="service-badge">
                                            {booking.service}
                                        </span>
                                    </td>


                                    <td>
                                        {booking.date}
                                    </td>


                                    <td>
                                        <span className="time-badge">
                                            {booking.time}
                                        </span>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Empty State */}
                {bookings.length === 0 && (
                    <div className="empty-state">
                        <div>📅</div>

                        <h3>No bookings yet</h3>

                        <p>
                            Customer bookings will appear here.
                        </p>
                    </div>
                )}

            </section>

        </div>
    );
}

export default AdminDashboard;