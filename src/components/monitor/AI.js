import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { GoogleGenerativeAI } from "@google/generative-ai";

function AIGeneratedContent() {
  const [autoContent, setAutoContent] = useState('');  // Auto-generated content
  const [content, setContent] = useState('');          // Content generated based on user input
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const genAI = new GoogleGenerativeAI("AIzaSyDf9K8Ya3djc2PO0YMmJmADRhuYFHMrgbc");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const defaultPrompt = "Me de 1 dica e 1 receita de Churrasco americano no total de 200 palavras. Estruture o texto com Cabecalho, Dica, Cabecalho com o nome da receita ,Receita.";
        
        const result = await model.generateContent(defaultPrompt);
        const response = await result.response;
        const text = await response.text();
        setAutoContent(text);  // Set the auto-fetched content
      } catch (error) {
        console.error('Error fetching AI-generated content:', error);
        setError('Could not fetch AI-generated content.');
      }
    };

    fetchContent();
    const intervalId = setInterval(fetchContent, 30000); // Refresh content every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyDf9K8Ya3djc2PO0YMmJmADRhuYFHMrgbc");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setContent(text);  // Set the content based on user input
    } catch (error) {
      console.error('Error fetching AI-generated content:', error);
      setError('Could not fetch AI-generated content.');
    }
  };

  const toggleContent = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Card for user input to generate new content */}
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ask Me
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Write here to generate content..."
              value={prompt}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Generate
            </Button>
          </form>
          {content && (
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
              {content}
            </Typography>
          )}
        </CardContent>
      </Card>
       {/* Card for automatically generated content */}
       <Card variant="outlined">
        <CardContent>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
          >
            <AutoStoriesIcon sx={{ mr: 1 }} />
            AI Tips - Powered by Google AI
            <Button onClick={toggleContent} sx={{ marginLeft: 'auto' }}>
              {isOpen ? 'Hide' : 'Show'}
            </Button>
          </Typography>
          {isOpen && (
            error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {autoContent || "No auto content available at the moment."}
              </Typography>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AIGeneratedContent;
