import React from "react";
import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";
import WeatherDetails from "../WeatherDetails/WeatherDetails";
import PageTitle from "../utils/PageTitle";
import Watermark from "../utils/Watermark";


function WeatherPage() {
  return (
    <Container style={{ padding: "20px", position: "relative" }}>
      <Watermark />
      <PageTitle title="LazyQ Inc." subtitle="Weather" />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" component={Link} to="/" color="primary">
          Home
        </Button>
      </div>
      <WeatherDetails /> {/* Renderizar o componente Log */}
    </Container>
  );
}

export default WeatherPage;
