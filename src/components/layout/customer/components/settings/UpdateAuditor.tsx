'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function UpdateAuditorModal() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Placeholder for submission logic
    console.log('Updated Auditor:', { firstName, lastName, password });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="purple">Update Auditor</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Auditor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* First Name Input */}
          <div>
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Last Name Input */}
          <div>
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button onClick={handleSubmit} variant="purple">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
