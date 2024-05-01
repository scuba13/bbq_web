import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAiConfig } from "../../Api";

function AIGeneratedContent() {
  const [autoContent, setAutoContent] = useState('');
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [aiKey, setAiKey] = useState(null);
  const [defaultTip, setDefaultTip] = useState('');

  useEffect(() => {
    getAiConfig().then(config => {
      setAiKey(config.aiKey);
      setDefaultTip(config.tip);  // Supondo que o campo se chama 'tip'
    }).catch(err => {
      console.error('Failed to fetch AI key:', err);
      setError('Could not load AI configuration.');
    });
  }, []);

  const genAI = useMemo(() => {
    if (aiKey) {
      return new GoogleGenerativeAI(aiKey);
    }
  }, [aiKey]);

  const model = useMemo(() => {
    if (genAI) {
      return genAI.getGenerativeModel({ model: "gemini-pro" });
    }
  }, [genAI]);

  const fetchContent = useCallback(async (prompt, setContent) => {
    if (!model) return;  // Ensure model is not undefined
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setContent(text);
    } catch (error) {
      console.error('Error fetching AI-generated content:', error);
      setError('Could not fetch AI-generated content.');
    }
  }, [model]);

  useEffect(() => {
    if (!model || !defaultTip || !isOpen) return;  // Prevent fetching before the model or tip is initialized or if content is hidden
    fetchContent(defaultTip, setAutoContent);
    const intervalId = setInterval(() => {
      if (isOpen) { // Only fetch new content if the content area is open
        fetchContent(defaultTip, setAutoContent);
      }
    }, 60000);
    return () => clearInterval(intervalId);
  }, [fetchContent, model, defaultTip, isOpen]);  // Add isOpen to the dependency array

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchContent(prompt, setContent);
  };

  const toggleContent = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpOutlineIcon sx={{ mr: 1 }} /> {/* Icon added here */}
            Ask Me
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth variant="outlined" label="Write here to generate content..." value={prompt} onChange={handleInputChange} sx={{ mb: 2 }} />
            <Button type="submit" variant="contained" color="primary">Generate</Button>
          </form>
          {content && <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>{content}</Typography>}
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoStoriesIcon sx={{ mr: 1 }} />
            AI Tips - Powered by Google AI
            <Button onClick={toggleContent} sx={{ marginLeft: 'auto' }}>{isOpen ? 'Hide' : 'Show'}</Button>
          </Typography>
          {isOpen && (error ? <Typography color="error">{error}</Typography> : <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>{autoContent || "No auto content available at the moment."}</Typography>)}
        </CardContent>
      </Card>
    </div>
  );
}

export default AIGeneratedContent;
