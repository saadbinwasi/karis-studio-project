import { useEffect, useState } from "react";
import "./admin.css";

function AdminDashboard() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        getBookings();
    }, []);

    // =========================
    // GET BOOKINGS
    // =========================

    async function getBookings() {

        const token = localStorage.getItem(
            "access_token"
        );

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/bookings",
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Token expired / invalid
            if (response.status === 401) {

                localStorage.removeItem(
                    "access_token"
                );

                window.location.reload();

                return;
            }

            // User is not admin
            if (response.status === 403) {

                alert("Admin access required.");

                return;
            }

            const data = await response.json();

            setBookings(data.bookings);

        } catch (error) {

            console.error(
                "Error fetching bookings:",
                error
            );
        }
    }


    // =========================
    // UPDATE BOOKING STATUS
    // =========================

    async function updateStatus(
        bookingId,
        newStatus
    ) {

        const token = localStorage.getItem(
            "access_token"
        );

        try {

            const response = await fetch(
                `http://127.0.0.1:8000/admin/bookings/${bookingId}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();


            // Token invalid / expired
            if (response.status === 401) {

                localStorage.removeItem(
                    "access_token"
                );

                window.location.reload();

                return;
            }


            // Not admin
            if (response.status === 403) {

                alert(
                    "Admin access required."
                );

                return;
            }


            // Other error
            if (!response.ok) {

                console.error(
                    "Status update failed:",
                    data
                );

                return;
            }


            // Update React state
            setBookings(
                (previousBookings) =>
                    previousBookings.map(
                        (booking) =>
                            booking.id === bookingId
                                ? {
                                    ...booking,
                                    status: newStatus,
                                }
                                : booking
                    )
            );

        } catch (error) {

            console.error(
                "Error updating booking status:",
                error
            );
        }
    }


    // =========================
    // DELETE BOOKING
    // =========================

    async function deleteBooking(
        bookingId
    ) {

        const token = localStorage.getItem(
            "access_token"
        );


        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this booking?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `http://127.0.0.1:8000/admin/bookings/${bookingId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            const data = await response.json();


            // Token invalid / expired
            if (response.status === 401) {

                localStorage.removeItem(
                    "access_token"
                );

                window.location.reload();

                return;
            }


            // Not admin
            if (response.status === 403) {

                alert(
                    "Admin access required."
                );

                return;
            }


            // Other error
            if (!response.ok) {

                console.error(
                    "Delete failed:",
                    data
                );

                return;
            }


            // Remove booking from React state
            setBookings(
                (previousBookings) =>
                    previousBookings.filter(
                        (booking) =>
                            booking.id !== bookingId
                    )
            );

        } catch (error) {

            console.error(
                "Error deleting booking:",
                error
            );
        }
    }


    // =========================
    // LOGOUT
    // =========================

    function logout() {

        localStorage.removeItem(
            "access_token"
        );

        window.location.reload();
    }


    // =========================
    // STATISTICS
    // =========================

    const pendingBookings =
        bookings.filter(
            (booking) =>
                booking.status === "pending"
        ).length;


    const confirmedBookings =
        bookings.filter(
            (booking) =>
                booking.status === "confirmed"
        ).length;


    const completedBookings =
        bookings.filter(
            (booking) =>
                booking.status === "completed"
        ).length;


    const cancelledBookings =
        bookings.filter(
            (booking) =>
                booking.status === "cancelled"
        ).length;


    return (

        <div className="admin-page">

            {/* =========================
                HEADER
            ========================= */}

            <header className="admin-header">

                <div>

                    <p className="admin-small-title">
                        KARIS STUDIO
                    </p>

                    <h1>
                        Admin Dashboard
                    </h1>

                </div>


                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>


            {/* =========================
                WELCOME
            ========================= */}

            <section className="welcome-section">

                <div>

                    <h2>
                        Welcome back, Admin ✨
                    </h2>

                    <p>
                        Manage your salon bookings
                        from one place.
                    </p>

                </div>

            </section>


            {/* =========================
                STATISTICS
            ========================= */}

            <section className="stats-container">


                {/* TOTAL */}

                <div className="stat-card">

                    <div className="stat-icon">
                        📅
                    </div>

                    <div>

                        <p>
                            Total Bookings
                        </p>

                        <h2>
                            {bookings.length}
                        </h2>

                    </div>

                </div>


                {/* PENDING */}

                <div className="stat-card">

                    <div className="stat-icon">
                        🟡
                    </div>

                    <div>

                        <p>
                            Pending
                        </p>

                        <h2>
                            {pendingBookings}
                        </h2>

                    </div>

                </div>


                {/* CONFIRMED */}

                <div className="stat-card">

                    <div className="stat-icon">
                        🟢
                    </div>

                    <div>

                        <p>
                            Confirmed
                        </p>

                        <h2>
                            {confirmedBookings}
                        </h2>

                    </div>

                </div>


                {/* COMPLETED */}

                <div className="stat-card">

                    <div className="stat-icon">
                        🔵
                    </div>

                    <div>

                        <p>
                            Completed
                        </p>

                        <h2>
                            {completedBookings}
                        </h2>

                    </div>

                </div>


                {/* CANCELLED */}

                <div className="stat-card">

                    <div className="stat-icon">
                        🔴
                    </div>

                    <div>

                        <p>
                            Cancelled
                        </p>

                        <h2>
                            {cancelledBookings}
                        </h2>

                    </div>

                </div>

            </section>


            {/* =========================
                BOOKINGS
            ========================= */}

            <section className="bookings-section">


                {/* SECTION HEADER */}

                <div className="section-header">

                    <div>

                        <p className="section-label">
                            BOOKINGS
                        </p>

                        <h2>
                            All Appointments
                        </h2>

                    </div>


                    <button
                        className="refresh-button"
                        onClick={getBookings}
                    >
                        ↻ Refresh
                    </button>

                </div>


                {/* =========================
                    TABLE
                ========================= */}

                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    Service
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Time
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {bookings.map(
                                (booking) => (

                                    <tr
                                        key={
                                            booking.id
                                        }
                                    >


                                        {/* ID */}

                                        <td>

                                            <span className="booking-id">

                                                #
                                                {
                                                    booking.id
                                                }

                                            </span>

                                        </td>


                                        {/* CUSTOMER */}

                                        <td>

                                            <div className="customer-info">

                                                <div className="customer-avatar">

                                                    {
                                                        booking.name
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()
                                                    }

                                                </div>


                                                <strong>

                                                    {
                                                        booking.name
                                                    }

                                                </strong>

                                            </div>

                                        </td>


                                        {/* PHONE */}

                                        <td>

                                            {
                                                booking.phone
                                            }

                                        </td>


                                        {/* SERVICE */}

                                        <td>

                                            <span className="service-badge">

                                                {
                                                    booking.service
                                                }

                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td>

                                            {
                                                booking.date
                                            }

                                        </td>


                                        {/* TIME */}

                                        <td>

                                            <span className="time-badge">

                                                {
                                                    booking.time
                                                }

                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <select
                                                value={
                                                    booking.status
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateStatus(
                                                        booking.id,
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >

                                                <option value="pending">
                                                    Pending
                                                </option>

                                                <option value="confirmed">
                                                    Confirmed
                                                </option>

                                                <option value="completed">
                                                    Completed
                                                </option>

                                                <option value="cancelled">
                                                    Cancelled
                                                </option>

                                            </select>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <button
                                                onClick={() =>
                                                    deleteBooking(
                                                        booking.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>


                {/* =========================
                    EMPTY STATE
                ========================= */}

                {bookings.length === 0 && (

                    <div className="empty-state">

                        <div>
                            📅
                        </div>

                        <h3>
                            No bookings yet
                        </h3>

                        <p>
                            Customer bookings will
                            appear here.
                        </p>

                    </div>

                )}

            </section>

        </div>
    );
}

export default AdminDashboard;