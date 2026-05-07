import React from 'react';
import PageLayout from '../layout/PageLayout';
import MQTTConfig from '../mqtt/MQTT';

function MQTTPage() {
  return (
    <PageLayout title="LazyQ Inc." subtitle="Dispositivo MQTT">
      <MQTTConfig />
    </PageLayout>
  );
}

export default MQTTPage;
