import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getLogContent } from '../../Api';

function LogCard() {
  const [logContent, setLogContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const content = await getLogContent();
      setLogContent(content);
    } catch {
      setError('Não foi possível carregar o log.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLog(); }, [fetchLog]);

  return (
    <Card variant="outlined" sx={{ maxWidth: 800, margin: '20px auto', backgroundColor: '#333', color: 'white' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon sx={{ fontSize: 30, mr: 1 }} /> Log
          </Typography>
          <Button startIcon={<RefreshIcon />} onClick={fetchLog} size="small" disabled={loading}>
            Atualizar
          </Button>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography variant="body1" color="error" align="center">{error}</Typography>
        )}
        {!loading && !error && (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
            {logContent}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default LogCard;
