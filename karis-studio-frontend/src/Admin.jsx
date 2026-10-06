import { useState } from "react";
import AdminDashboard from "./AdminDashboard";

function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // Agar login successful hai,
  // to login form ki jagah dashboard show hoga
  if (loggedIn) {
    return <AdminDashboard />;
  }

  async function handleLogin(e) {
    e.preventDefault();

    const loginData = {
      username: username,
      password: password,
    };

    console.log("Sending:", loginData);

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

  return (
    <div>
      <h1>Karis Studio Admin</h1>

      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>

        <p>{message}</p>
      </form>
    </div>
  );
}

export default Admin;