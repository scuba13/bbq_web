import React from 'react';
import PageLayout from '../layout/PageLayout';
import Diagnostics from '../diagnostics/Diagnostics';

export default function DiagnosticsPage() {
  return (
    <PageLayout title="LazyQ Inc." subtitle="Diagnósticos">
      <Diagnostics />
    </PageLayout>
  );
}
