import React from "react";
import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";
import System from "../system/System"; // Importar o componente Monitor
import PageTitle from "../utils/PageTitle";
import Watermark from "../utils/Watermark";

function SystemPage() {
  return (
    <Container style={{ padding: "20px", position: "relative" }}>
      <Watermark />
      <PageTitle title="LazyQ Inc." subtitle="System" />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" component={Link} to="/" color="primary">
          Home
        </Button>
      </div>
      <System /> {/* Renderizar o componente Monitor */}
    </Container>
  );
}

export default SystemPage;
