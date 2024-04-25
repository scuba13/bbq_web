import React from "react";
import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Monitor from "../monitor/Monitor"; // Importar o componente Monitor
import PageTitle from "../utils/PageTitle";
import Watermark from "../utils/Watermark";

function MonitorPage() {
  return (
    <Container style={{ padding: "20px", position: "relative" }}>
      <Watermark />
      <PageTitle title="LazyQ Inc." subtitle="Web BBQ Monitor" />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" component={Link} to="/" color="primary">
          Home
        </Button>
      </div>
      <Monitor /> {/* Renderizar o componente Monitor */}
    </Container>
  );
}

export default MonitorPage;
