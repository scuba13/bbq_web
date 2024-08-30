import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, CircularProgress, Box } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { getLogContent } from '../../Api';

function LogCard() {
  const [logContent, setLogContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogContent = async () => {
      try {
        const content = await getLogContent();
        setLogContent(content);
      } catch (error) {
        setError('Unable to fetch log content.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogContent();
  }, []);

  return (
    <Card variant="outlined" style={{ maxWidth: '800px', margin: '20px auto', backgroundColor: '#333', color: 'white' }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom style={{ display: "flex", alignItems: "center" }}>
          <DescriptionIcon style={{ fontSize: 30, marginRight: 5 }} /> Log Content
        </Typography>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        )}
        {!loading && !error && (
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {logContent}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default LogCard;
