'use client';
import React from 'react';
import QuestionnairesReviewSection from '../write-offs/QuestionnairesReviewSection';
import WriteOffsTableSection from '../write-offs/WriteOffsTableSection';

const DashboardOverviewSection = () => {
  return (
    <div className="grid grid-cols-12 gap-2 mt-2">
      <WriteOffsTableSection />
      <QuestionnairesReviewSection />
    </div>
  );
};

export default DashboardOverviewSection;
