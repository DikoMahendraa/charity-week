"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { DateTimePicker } from "@/components/dashboard/date-time-picker";

export function AddChallengeDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dateOfEvent, setDateOfEvent] = useState<Date | undefined>(undefined);
  const [price, setPrice] = useState("");
  const [cap, setCap] = useState("");

  const handleClose = (val: boolean) => {
    if (!val) {
      setName("");
      setDateOfEvent(undefined);
      setPrice("");
      setCap("");
    }
    setOpen(val);
  };

  return (
    <>
      <Button
        className="gap-1.5 bg-[#EC8900] text-white font-bold hover:bg-[#d47800] whitespace-nowrap"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        New Challenges
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          showCloseButton={true}
          className="sm:max-w-lg px-8 py-8 gap-0"
        >
          <DialogTitle className="text-xl font-bold text-[#161616] mb-6">
            Add New Challenge
          </DialogTitle>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Challenge name
              </label>
              <Input
                placeholder="CW 10K Run"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Date of event
              </label>
              <DateTimePicker
                value={dateOfEvent}
                onChange={setDateOfEvent}
                placeholder="Pick a date & time"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Price ($)
                </label>
                <Input
                  type="number"
                  placeholder="25"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Cap (max participants)
                </label>
                <Input
                  type="number"
                  placeholder="200"
                  value={cap}
                  onChange={(e) => setCap(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6 h-12 bg-[#EC8900] hover:bg-[#d47800] text-white font-bold text-sm"
            onClick={() => handleClose(false)}
          >
            Add New Challenge
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
