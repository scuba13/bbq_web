import React from 'react';
import { Box } from '@mui/material';
import PageLayout from '../layout/PageLayout';
import Monitor from '../monitor/Monitor';
import AIGeneratedContent from '../monitor/AI';

function MonitorPage() {
  return (
    <PageLayout title="LazyQ Inc." subtitle="Monitor BBQ">
      <Monitor />
      <Box mt={4}>
        <AIGeneratedContent />
      </Box>
    </PageLayout>
  );
}

export default MonitorPage;
