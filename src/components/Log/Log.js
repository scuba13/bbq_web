import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { getLogContent } from "../../Api";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";

function Log() {
  const [logContent, setLogContent] = useState("");

  useEffect(() => {
    // Função para buscar o conteúdo do log e atualizar o estado
    const fetchLogContent = async () => {
      try {
        const content = await getLogContent();
        setLogContent(content);
      } catch (error) {
        console.error("Error fetching log content:", error);
      }
    };

    // Chamar a função inicialmente
    fetchLogContent();

    // Configurar a intervalo para buscar o log a cada 1 segundo
    const intervalId = setInterval(fetchLogContent, 1000);

    // Limpar o intervalo quando o componente for desmontado para evitar vazamentos de memória
    return () => clearInterval(intervalId);
  }, []); // O array vazio garante que o useEffect seja executado apenas uma vez após a montagem do componente

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ display: "flex", alignItems: "center" }}
        >
          <NotesOutlinedIcon style={{ marginRight: 5 }} />
          Log Content
        </Typography>

        {/* Exibir o conteúdo do log */}
        <Typography component="pre" style={{ whiteSpace: "pre-wrap" }}>
          {logContent}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Log;
