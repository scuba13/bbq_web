import React from 'react';
import { Box } from '@mui/material';
import PageLayout from '../layout/PageLayout';
import System from '../system/System';
import TempLimits from '../system/TempLimits';
import TempCalibration from '../system/TempCalibration';
import AIConfig from '../system/AIConfig';
import FirmwareUpload from '../system/FirmwareUpload';

function SystemPage() {
  return (
    <PageLayout title="LazyQ Inc." subtitle="System">
      <Box mb={3}><System /></Box>
      <Box mb={3}><TempLimits /></Box>
      <Box mb={3}><TempCalibration /></Box>
      <Box mb={3}><AIConfig /></Box>
      <Box mb={3}><FirmwareUpload /></Box>
    </PageLayout>
  );
}

export default SystemPage;
