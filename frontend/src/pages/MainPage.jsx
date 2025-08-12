import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        gap: "40px",
      }}
    >
      <h1>Welcome, Student!</h1>
      <button
        onClick={() => navigate("/lost")}
        style={{
          padding: "30px 60px",
          fontSize: "24px",
          borderRadius: "10px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          width: "250px",
        }}
      >
        Report Lost Item
      </button>
      <button
        onClick={() => navigate("/found")}
        style={{
          padding: "30px 60px",
          fontSize: "24px",
          borderRadius: "10px",
          cursor: "pointer",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          width: "250px",
        }}
      >
        Report Found Item
      </button>
    </div>
  );
};

export default MainPage;
