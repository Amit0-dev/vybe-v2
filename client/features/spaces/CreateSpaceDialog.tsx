"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface CreateSpaceFormData {
  name: string;
  password: string;
}

interface CreateSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CreateSpaceFormData) => void;
}

export function CreateSpaceDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateSpaceDialogProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = name.trim().length > 0 && password.length >= 6;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit?.({ name: name.trim(), password });
    setName("");
    setPassword("");
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => onOpenChange(nextOpen)}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a Space</DialogTitle>
            <DialogDescription>
              Name your music room and set a password friends will use to join.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="space-name" className="text-sm font-medium">
                Space name
              </label>
              <Input
                id="space-name"
                placeholder="Friday Night"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                autoComplete="off"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="space-password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="space-password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                maxLength={100}
                autoComplete="new-password"
                className="h-10"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 border-0 bg-transparent p-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
