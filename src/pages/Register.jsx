import { useState } from "react";
import API from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const response = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration Successful");

      console.log(response.data);
    } catch (error) {
  console.log("REGISTER ERROR");
  alert(JSON.stringify(error.response?.data));
console.log(error.response?.data);
  console.log(error.response?.status);

  alert("Registration Failed");
}
  };

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1>Register</h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={register}>
        Register
      </button>
    </div>
  );
};

export default Register;