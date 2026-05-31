import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      if (!name || !email || !password) {
        return alert("Please fill all fields");
      }

      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration Successful");

      navigate("/profile");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        color: "white",
      }}
    >
      <h1>Create Account</h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        style={{
          padding: "10px",
          width: "300px",
        }}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        style={{
          padding: "10px",
          width: "300px",
        }}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        style={{
          padding: "10px",
          width: "300px",
        }}
      />

      <br /><br />

      <button
        onClick={register}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Register
      </button>

      <br /><br />

      <Link to="/profile">
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Register;