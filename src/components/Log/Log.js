import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import { getLogContent } from '../../Api';

function Log() {
  const [logContent, setLogContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogContent = async () => {
      try {
        const content = await getLogContent();
        setLogContent(content);
      } catch (error) {
        console.error('Error fetching log content:', error);
        setError('Could not fetch log content.');
      }
    };

    fetchLogContent();
    const intervalId = setInterval(fetchLogContent, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <NotesOutlinedIcon sx={{ mr: 1 }} />
          Log Content
        </Typography>

        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {logContent || "No log content available."}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default Log;
