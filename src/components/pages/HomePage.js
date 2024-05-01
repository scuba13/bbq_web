import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "@mui/material";
import PageTitle from "../utils/PageTitle"; // Importa o componente de título

function HomePage() {
  return (
    <Container
      maxWidth="sm"
      style={{ textAlign: "center", padding: "40px 0", position: "relative" }}
    >
      <PageTitle title="LazyQ Inc." subtitle="LazyQ-Display" />
      <div>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/monitor"
        >
          Monitor
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/mqtt">
          MQTT
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/log">
          Log
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/system">
          System
        </Button>
      </div>
      <img
        src="/logo_gato.webp"
        alt="LazyQ Inc. Logo"
        style={{ maxWidth: "100%", height: "auto", marginTop: "20px" }}
      />
    </Container>
  );
}

export default HomePage;
