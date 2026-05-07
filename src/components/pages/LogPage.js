import React from 'react';
import PageLayout from '../layout/PageLayout';
import Log from '../log/Log';

function LogPage() {
  return (
    <PageLayout title="LazyQ Inc." subtitle="Log">
      <Log />
    </PageLayout>
  );
}

export default LogPage;
