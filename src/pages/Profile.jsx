import { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/auth/profile");
      setUser(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchProfile();
    }
  }, []);

  const login = async () => {
    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      await fetchProfile();

      alert("Login successful");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setEmail("");
    setPassword("");
  };

  return (
    <div
      style={{
        padding: "30px",
        color: "#ffffff",
      }}
    >
      <h1>Profile</h1>

      {!user ? (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              maxWidth: "400px",
            }}
          >
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={login}
              style={{
                padding: "12px",
                background: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Login
            </button>

            <Link to="/register">
              <button
                style={{
                  padding: "12px",
                  width: "100%",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Create Account
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            maxWidth: "500px",
            marginTop: "20px",
          }}
        >
          <h2>User Details</h2>

          <p>
            <strong>Name:</strong>{" "}
            {user.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user.email}
          </p>

          <p>
            <strong>ID:</strong>{" "}
            {user._id}
          </p>

          <button
            onClick={logout}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;