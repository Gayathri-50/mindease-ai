import { useState, useEffect } from "react";
import API from "../services/api";

const Habits = () => {
  const [habitName, setHabitName] = useState("");
  const [habits, setHabits] = useState([]);

  const getHabits = async () => {
    try {
      const response = await API.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.error("getHabits error", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert("Failed to load habits (check console for details)");
    }
  };

  const addHabit = async () => {
    if (!habitName.trim()) {
      alert("Please enter a habit");
      return;
    }

    try {
      await API.post("/habits", {
        name: habitName,
      });

      setHabitName("");

      await getHabits();

      alert("Habit added successfully");
    } catch (error) {
      console.error("addHabit error", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert("Failed to add habit (check console for details)");
    }
  };

  const toggleHabit = async (id) => {
    try {
      await API.put(`/habits/${id}`);

      getHabits();
    } catch (error) {
      console.error("toggleHabit error", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert("Failed to update habit (check console for details)");
    }
  };

  const deleteHabit = async (id) => {
    try {
      await API.delete(`/habits/${id}`);

      getHabits();

      alert("Habit deleted successfully");
    } catch (error) {
      console.error("deleteHabit error", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert("Failed to delete habit (check console for details)");
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  const completedCount = habits.filter(
    (habit) => habit.completed
  ).length;

  const pendingCount = habits.filter(
    (habit) => !habit.completed
  ).length;

  return (
    <div
      style={{
        padding: "30px",
        color: "#ffffff",
      }}
    >
      <h1>Habit Tracker</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            backgroundColor: "#22c55e",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "150px",
          }}
        >
          <h3>✅ Completed</h3>
          <h1>{completedCount}</h1>
        </div>

        <div
          style={{
            backgroundColor: "#ef4444",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "150px",
          }}
        >
          <h3>❌ Pending</h3>
          <h1>{pendingCount}</h1>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Enter habit"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          style={{
            padding: "12px",
            width: "300px",
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
            marginRight: "10px",
          }}
        />

        <button
          onClick={addHabit}
          style={{
            padding: "12px 20px",
            backgroundColor: "#22c55e",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Add Habit
        </button>
      </div>

      <h2>Habit List</h2>

      {habits.length === 0 ? (
        <p>No habits found</p>
      ) : (
        habits.map((habit) => (
          <div
            key={habit._id}
            style={{
              backgroundColor: "#1e293b",
              padding: "15px",
              marginTop: "10px",
              borderRadius: "10px",
            }}
          >
            <h3>{habit.name}</h3>

            <p>
              Status:{" "}
              {habit.completed
                ? "✅ Completed"
                : "❌ Pending"}
            </p>

            <button
              onClick={() => toggleHabit(habit._id)}
              style={{
                padding: "8px 15px",
                marginRight: "10px",
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Toggle Status
            </button>

            <button
              onClick={() => deleteHabit(habit._id)}
              style={{
                padding: "8px 15px",
                backgroundColor: "#ef4444",
                color: "#ffffff",
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

export default Habits;