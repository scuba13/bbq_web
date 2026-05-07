import React from 'react';
import { Box } from '@mui/material';
import PageLayout from '../layout/PageLayout';
import System from '../system/System';
import TempLimits from '../system/TempLimits';
import TempCalibration from '../system/TempCalibration';
import AIConfig from '../system/AIConfig';
import FirmwareUpload from '../system/FirmwareUpload';
import FirmwareVersion from '../system/FirmwareVersion';
import AuthConfig from '../system/AuthConfig';

function SystemPage() {
  return (
    <PageLayout title="LazyQ Inc." subtitle="Sistema">
      <Box mb={3}><System /></Box>
      <Box mb={3}><AuthConfig /></Box>
      <Box mb={3}><TempLimits /></Box>
      <Box mb={3}><TempCalibration /></Box>
      <Box mb={3}><AIConfig /></Box>
      <Box mb={3}><FirmwareVersion /></Box>
      <Box mb={3}><FirmwareUpload /></Box>
    </PageLayout>
  );
}

export default SystemPage;
