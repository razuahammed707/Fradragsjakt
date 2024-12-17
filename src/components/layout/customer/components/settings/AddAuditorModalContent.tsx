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

export function AddAuditorModal() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendInvite = () => {
    // Placeholder for submission logic
    console.log('Invite Sent:', { email, message });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="purple">Add Auditor</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Auditor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter auditor's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Message Input */}
          <div>
            <Label htmlFor="message">Message (optional)</Label>
            <textarea
              id="message"
              placeholder="Add a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button onClick={handleSendInvite} variant={'purple'}>
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
