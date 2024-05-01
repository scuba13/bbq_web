import React from "react";
import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";
import System from "../system/System"; // Importar o componente System
import Upload from "../system/FirmwareUpload"; // Importar o componente FirmwareUpload
import TempConfig from "../system/TempConfig"; // Importar o componente TempConfig
import AIConfig from "../system/AIConfig"; // Importar o componente AIConfig
import PageTitle from "../utils/PageTitle";
import Watermark from "../utils/Watermark";

function SystemPage() {
  const componentStyle = { marginBottom: "20px" }; // Estilo para espaçamento entre componentes

  return (
    <Container style={{ padding: "20px", position: "relative" }}>
      <Watermark />
      <PageTitle title="LazyQ Inc." subtitle="System" />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" component={Link} to="/" color="primary">
          Home
        </Button>
      </div>
      <div style={componentStyle}>
        <System /> {/* Renderizar o componente Monitor */}
      </div>
      <div style={componentStyle}>
        <TempConfig /> {/* Renderizar o componente TempConfig */}
      </div>
      <div style={componentStyle}>
        <AIConfig /> {/* Renderizar o componente AIConfig */}
      </div>
      <div style={componentStyle}>
        <Upload /> {/* Renderizar o componente FirmwareUpload */}
      </div>
    </Container>
  );
}

export default SystemPage;
