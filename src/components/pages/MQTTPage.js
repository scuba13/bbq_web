import React from "react";
import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";
import MQTT from "../MQTT/MQTT"; // Importar o componente Monitor
import PageTitle from "../utils/PageTitle";
import Watermark from "../utils/Watermark";






function MQTTPage() {
  return (
    <Container style={{ padding: "20px", position: "relative" }}>
      <Watermark />
      <PageTitle title="LazyQ Inc." subtitle="MQTT Device" />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" component={Link} to="/" color="primary">
          Home
        </Button>
      </div>
      <MQTT /> {/* Renderizar o componente MQTT */}
    </Container>
  );
}

export default MQTTPage;
