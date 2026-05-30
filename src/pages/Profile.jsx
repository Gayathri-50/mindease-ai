import { useState } from "react";
import API from "../services/api";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

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

      alert("Login successful");

      console.log(response.data);

    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  const getProfile = async () => {
    try {
      const response = await API.get("/auth/profile");

      setUser(response.data.user);

      alert("Profile fetched successfully");

      console.log(response.data);

    } catch (error) {
      console.log(error);
      alert("Failed to fetch profile");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        color: "#ffffff",
      }}
    >
      <h1
        style={{
          color: "#ffffff",
          marginBottom: "20px",
        }}
      >
        Profile
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            padding: "12px",
            width: "250px",
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            padding: "12px",
            width: "250px",
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <button
          onClick={login}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#22c55e",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <button
          onClick={getProfile}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Get Profile
        </button>
      </div>

      {user && (
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            maxWidth: "500px",
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
        </div>
      )}
    </div>
  );
};

export default Profile;