import React from "react";
import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Log from "../Log/Log"; // Importar o componente Monitor
import PageTitle from "../utils/PageTitle";
import Watermark from "../utils/Watermark";






function LogPage() {
  return (
    <Container style={{ padding: "20px", position: "relative" }}>
      <Watermark />
      <PageTitle title="LazyQ Inc." subtitle="Log" />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" component={Link} to="/" color="primary">
          Home
        </Button>
      </div>
      <Log /> {/* Renderizar o componente Log */}
    </Container>
  );
}

export default LogPage;
