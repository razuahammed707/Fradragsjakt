'use client';

import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import { AddAuditorModal } from './components/settings/AddAuditorModalContent';

export default function CustomerSettings() {
  return (
    <ProtectedLayout>
      <div>Setting page</div>
      <AddAuditorModal></AddAuditorModal>
    </ProtectedLayout>
  );
}
