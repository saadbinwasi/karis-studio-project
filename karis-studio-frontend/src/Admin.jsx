import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import "./admin.css";

function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return <AdminDashboard />;
  }

  async function handleLogin(e) {
    e.preventDefault();

    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      if (data.success) {
        localStorage.setItem(
          "access_token",
          data.access_token
        );

        setLoggedIn(true);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-logo">
          K
        </div>

        <div className="admin-login-heading">
          <p className="admin-login-eyebrow">
            KARIS STUDIO
          </p>

          <h1>Welcome Back</h1>

          <p>
            Sign in to access your admin dashboard.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="admin-login-form"
        >

          <div className="admin-login-field">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="admin-login-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
          >
            Sign In
          </button>

          {message && (
            <p className="admin-login-message">
              {message}
            </p>
          )}

        </form>

        <p className="admin-login-footer">
          Karis Studio Admin Panel
        </p>

      </div>

    </div>
  );
}

export default Admin;

