import React from "react";

const About = () => {
  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px",
    background: "#18181b",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <img
        src="/ShopNestLogo.png"
        alt="ShopNest"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "24px",
          objectFit: "cover",
          border: "3px solid #f97316",
          marginBottom: "20px",
          boxShadow: "0 4px 20px rgba(249, 115, 22, 0.4)",
        }}
      />
      <h2 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#fff" }}>
        About ShopNest
      </h2>
      <h3
        style={{ fontSize: "1.5rem", color: "#f97316", marginBottom: "15px" }}
      >
        Your Trusted E-Commerce Destination
      </h3>

      <p
        style={{
          color: "#a1a1aa",
          fontSize: "1.1rem",
          lineHeight: "1.8",
          maxWidth: "650px",
          margin: "0 auto",
        }}
      >
        ShopNest is dedicated to providing high-quality products with a
        seamless, modern shopping experience. From browsing to secure checkout
        with instant order updates, we prioritize customer satisfaction at every
        step.
      </p>
    </div>
  );
};

export default About;
