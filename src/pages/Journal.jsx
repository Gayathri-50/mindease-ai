import { useState, useEffect } from "react";
import API from "../services/api";

const Journal = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [journals, setJournals] = useState([]);

  const getJournals = async () => {
    try {
      const response = await API.get("/journal");
      setJournals(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load journals");
    }
  };

  const saveJournal = async () => {
    try {
      await API.post("/journal", {
        title,
        content,
      });

      alert("Journal saved successfully");

      setTitle("");
      setContent("");

      getJournals();

    } catch (error) {
      console.log(error);
      alert("Failed to save journal");
    }
  };

  const deleteJournal = async (id) => {
    try {
      await API.delete(`/journal/${id}`);

      alert("Journal deleted successfully");

      getJournals();

    } catch (error) {
      console.log(error);
      alert("Failed to delete journal");
    }
  };

  useEffect(() => {
    getJournals();
  }, []);

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
        Journal
      </h1>

      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontSize: "18px",
          color: "#ffffff",
        }}
      >
        Title
      </label>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter journal title"
        style={{
          width: "400px",
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

      <label
        style={{
          display: "block",
          marginBottom: "10px",
          fontSize: "18px",
          color: "#ffffff",
        }}
      >
        Journal Entry
      </label>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        style={{
          width: "500px",
          height: "180px",
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
        onClick={saveJournal}
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
        Save Journal
      </button>

      <h2
        style={{
          marginTop: "30px",
          color: "#ffffff",
        }}
      >
        Journal History
      </h2>

      {journals.length === 0 ? (
        <p>No journal entries found</p>
      ) : (
        journals.map((journal) => (
          <div
            key={journal._id}
            style={{
              backgroundColor: "#1e293b",
              padding: "15px",
              marginTop: "10px",
              borderRadius: "10px",
              color: "#ffffff",
            }}
          >
            <h3>{journal.title}</h3>

            <p>{journal.content}</p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(journal.createdAt).toLocaleString()}
            </p>

            <button
              onClick={() => deleteJournal(journal._id)}
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

export default Journal;