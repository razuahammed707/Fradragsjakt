'use client';
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import AuditorsTable from './AuditorsTable';

export default function SettingsTab() {
  const [activeTab, setActiveTab] = useState<'profile' | 'auditors'>('profile');

  return (
    <div className="rounded-2xl p-6 bg-white h-full">
      <h2 className="text-xl font-bold text-[#101010]">Settings</h2>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'profile' | 'auditors')}
        className="mt-4"
      >
        <div className="border-b">
          <TabsList className="bg-transparent p-0 h-auto space-x-6">
            <TabsTrigger
              className="bg-transparent shadow-none data-[state=active]:shadow-none border-b-2 border-transparent  data-[state=active]:border-b-2  data-[state=active]:border-[#5B52F9] rounded-none px-0"
              value="profile"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              className="bg-transparent shadow-none data-[state=active]:shadow-none border-b-2 border-transparent  data-[state=active]:border-b-2  data-[state=active]:border-[#5B52F9] rounded-none px-0"
              value="auditors"
            >
              Auditors
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Update Profile</h3>
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-600">
                Profile update form goes here. Add inputs like name, email, and
                password change fields.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="auditors">
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <SearchInput placeholder="Search auditors..." />
              <Button>Add Auditor</Button>
            </div>

            <AuditorsTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
