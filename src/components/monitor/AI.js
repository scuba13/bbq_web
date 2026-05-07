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
      setDefaultTip(config.tip);
    }).catch(() => {
      setError('Não foi possível carregar a configuração de AI.');
    });
  }, []);

  const genAI = useMemo(() => aiKey ? new GoogleGenerativeAI(aiKey) : null, [aiKey]);

  // W-05: gemini-pro descontinuado → gemini-1.5-flash
  const model = useMemo(() => genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null, [genAI]);

  const fetchContent = useCallback(async (promptText, setFn) => {
    if (!model) return;
    try {
      const result = await model.generateContent(promptText);
      const text = await result.response.text();
      setFn(text);
    } catch {
      setError('Não foi possível obter conteúdo da AI.');
    }
  }, [model]);

  useEffect(() => {
    if (!model || !defaultTip || !isOpen) return;
    fetchContent(defaultTip, setAutoContent);
    const id = setInterval(() => {
      if (isOpen) fetchContent(defaultTip, setAutoContent);
    }, 60000);
    return () => clearInterval(id);
  }, [fetchContent, model, defaultTip, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchContent(prompt, setContent);
  };

  return (
    <div>
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpOutlineIcon sx={{ mr: 1 }} />
            Ask Me - Powered by Google AI
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Escreva aqui..." value={prompt}
              onChange={e => setPrompt(e.target.value)} sx={{ mb: 2 }} />
            <Button type="submit" variant="contained">Enviar</Button>
          </form>
          {content && (
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>{content}</Typography>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoStoriesIcon sx={{ mr: 1 }} />
            BBQ AI Tips - Powered by Google AI
            <Button onClick={() => setIsOpen(o => !o)} sx={{ ml: 'auto' }}>
              {isOpen ? 'Ocultar' : 'Mostrar'}
            </Button>
          </Typography>
          {isOpen && (
            error
              ? <Typography color="error">{error}</Typography>
              : <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {autoContent || 'Nenhum conteúdo disponível no momento.'}
                </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AIGeneratedContent;
