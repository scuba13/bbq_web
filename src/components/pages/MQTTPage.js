import React from 'react';
import PageLayout from '../layout/PageLayout';
import MQTTConfig from '../MQTT/MQTT';

function MQTTPage() {
  return (
    <PageLayout title="LazyQ Inc." subtitle="MQTT Device">
      <MQTTConfig />
    </PageLayout>
  );
}

export default MQTTPage;
