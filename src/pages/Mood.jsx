import { useState, useEffect } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const Mood = () => {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState([]);

  const getMoods = async () => {
    try {
      const response = await API.get("/moods");
      setMoods(response.data);
    } catch (error) {
      console.error("getMoods error", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert("Failed to load moods (check console for details)");
    }
  };

  const saveMood = async () => {
    try {
      await API.post("/moods", {
        mood,
        note,
      });

      alert("Mood saved successfully");

      setMood("");
      setNote("");

      getMoods();

    } catch (error) {
      console.error("saveMood error", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert("Failed to save mood (check console for details)");
    }
  };

const deleteMood = async (id) => {
  try {

    await API.delete(`/moods/${id}`);

    alert("Mood deleted successfully");

    getMoods();

  } catch (error) {

    console.error("deleteMood error", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    alert("Failed to delete mood (check console for details)");

  }
};
  useEffect(() => {
    getMoods();
  }, []);
const happyCount = moods.filter(
  (item) => item.mood === "Happy"
).length;

const neutralCount = moods.filter(
  (item) => item.mood === "Neutral"
).length;

const sadCount = moods.filter(
  (item) => item.mood === "Sad"
).length;
const data = [
  {
    name: "Happy",
    value: happyCount,
  },
  {
    name: "Neutral",
    value: neutralCount,
  },
  {
    name: "Sad",
    value: sadCount,
  },
];

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];
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
        Mood Tracker
      </h1>
      <div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  }}
>
  <div
    style={{
      background: "#22c55e",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "150px",
      color: "white",
    }}
  >
    <h3>😊 Happy</h3>
    <h1>{happyCount}</h1>
  </div>

  <div
    style={{
      background: "#f59e0b",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "150px",
      color: "white",
    }}
  >
    <h3>😐 Neutral</h3>
    <h1>{neutralCount}</h1>
  </div>

  <div
    style={{
      background: "#ef4444",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "150px",
      color: "white",
    }}
  >
    <h3>😔 Sad</h3>
    <h1>{sadCount}</h1>
  </div>
</div>
<div
  style={{
    marginTop: "20px",
    marginBottom: "30px",
    backgroundColor: "#0f172a",
    padding: "24px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "780px",
  }}
>
  <h2 style={{ color: "white", marginBottom: "18px" }}>
    Mood Analytics
  </h2>

  <div style={{ width: "100%", height: 340 }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          fill="#8884d8"
          dataKey="value"
          label={{ fill: "#f8fafc", fontSize: 12 }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            color: "#f8fafc",
          }}
          cursor={{ fill: "rgba(255,255,255,0.08)" }}
        />
        <Legend
          wrapperStyle={{ color: "#cbd5e1", fontSize: 14 }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontSize: "18px",
          color: "#ffffff",
        }}
      >
        Select Mood
      </label>

      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        style={{
          width: "300px",
          padding: "12px",
          backgroundColor: "#ffffff",
          color: "#000000",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      >
        <option value="">Select Mood</option>
        <option value="Happy">😊 Happy</option>
        <option value="Neutral">😐 Neutral</option>
        <option value="Sad">😔 Sad</option>
      </select>

      <br />
      <br />

      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontSize: "18px",
          color: "#ffffff",
        }}
      >
        Note
      </label>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="How are you feeling today?"
        style={{
          width: "400px",
          height: "120px",
          padding: "12px",
          backgroundColor: "#ffffff",
          color: "#000000",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      <br />
      <br />

      <button
        onClick={saveMood}
        style={{
          padding: "10px 20px",
          backgroundColor: "#22c55e",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Save Mood
      </button>

      <h2
        style={{
          marginTop: "30px",
          color: "#ffffff",
        }}
      >
        Mood History
      </h2>

      {moods.length === 0 ? (
        <p style={{ color: "#ffffff" }}>
          No moods found
        </p>
      ) : (
        moods.map((item) => (
          <div
            key={item._id}
            style={{
              backgroundColor: "#1e293b",
              padding: "15px",
              marginTop: "10px",
              borderRadius: "10px",
              color: "#ffffff",
            }}
          >
            <p>
              <strong>Mood:</strong> {item.mood}
            </p>

            <p>
              <strong>Note:</strong> {item.note}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>
            <button
  onClick={() => deleteMood(item._id)}
  style={{
    padding: "8px 15px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Delete
</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Mood;