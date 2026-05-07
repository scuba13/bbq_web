import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, Typography, Button, TextField, CircularProgress } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAiConfig } from "../../Api";

function AIGeneratedContent() {
  const [askContent, setAskContent]   = useState('');
  const [askError, setAskError]       = useState('');
  const [askLoading, setAskLoading]   = useState(false);
  const [prompt, setPrompt]           = useState('');

  const [tipsContent, setTipsContent] = useState('');
  const [tipsError, setTipsError]     = useState('');
  const [tipsLoading, setTipsLoading] = useState(false);
  const [isOpen, setIsOpen]           = useState(false);

  const [aiKey, setAiKey]         = useState(null);
  const [defaultTip, setDefaultTip] = useState('');

  useEffect(() => {
    getAiConfig().then(config => {
      setAiKey(config.aiKey || null);
      setDefaultTip(config.tip || '');
    }).catch(err => {
      console.error('Erro ao carregar config AI:', err);
    });
  }, []);

  const model = useMemo(() => {
    if (!aiKey) return null;
    const genAI = new GoogleGenerativeAI(aiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }, [aiKey]);

  // Busca dica automática quando abre o painel
  useEffect(() => {
    if (!isOpen || !model || !defaultTip) return;

    let cancelled = false;
    setTipsLoading(true);
    setTipsError('');
    setTipsContent('');

    model.generateContent(defaultTip)
      .then(r => { if (!cancelled) setTipsContent(r.response.text()); })
      .catch(err => {
        console.error('Erro ao buscar dica automática:', err);
        if (!cancelled) setTipsError(err.message || 'Não foi possível obter dica.');
      })
      .finally(() => { if (!cancelled) setTipsLoading(false); });

    const id = setInterval(() => {
      if (!isOpen) return;
      model.generateContent(defaultTip)
        .then(r => { if (!cancelled) setTipsContent(r.response.text()); })
        .catch(err => console.error('Erro no refresh da dica:', err));
    }, 60000);

    return () => { cancelled = true; clearInterval(id); };
  }, [isOpen, model, defaultTip]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !model) return;
    setAskLoading(true);
    setAskError('');
    setAskContent('');
    try {
      const result = await model.generateContent(prompt);
      setAskContent(result.response.text());
    } catch (err) {
      console.error('Erro no Ask Me:', err);
      setAskError(err.message || 'Não foi possível obter resposta.');
    } finally {
      setAskLoading(false);
    }
  };

  const handleToggleTips = () => {
    setIsOpen(o => !o);
    // Limpa erro ao fechar/abrir para permitir nova tentativa
    setTipsError('');
  };

  return (
    <div>
      {/* Ask Me */}
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpOutlineIcon sx={{ mr: 1 }} />
            Ask Me - Powered by Google AI
          </Typography>
          <form onSubmit={handleAsk}>
            <TextField
              fullWidth label="Escreva aqui..." value={prompt}
              onChange={e => setPrompt(e.target.value)} sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" disabled={askLoading || !model}>
              {askLoading ? <CircularProgress size={20} /> : 'Enviar'}
            </Button>
          </form>
          {askError && <Typography color="error" sx={{ mt: 1 }}>{askError}</Typography>}
          {askContent && (
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
              {askContent}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Auto Tips */}
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoStoriesIcon sx={{ mr: 1 }} />
            BBQ AI Tips - Powered by Google AI
            <Button onClick={handleToggleTips} sx={{ ml: 'auto' }}>
              {isOpen ? 'Ocultar' : 'Mostrar'}
            </Button>
          </Typography>

          {isOpen && (
            tipsLoading
              ? <CircularProgress size={24} />
              : tipsError
                ? <Typography color="error">{tipsError}</Typography>
                : <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {tipsContent || 'Nenhum conteúdo disponível no momento.'}
                  </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AIGeneratedContent;
