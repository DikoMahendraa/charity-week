"use client";

import { useState } from "react";
import { Plus, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/dashboard/date-time-picker";

const INSTITUTIONS = [
  "Imperial College London",
  "Newton Academy",
  "Madinah University Society",
  "East Mosque London",
  "Al-Noor Islamic School",
];

const LOCATIONS = [
  "Bradford, UK",
  "London, UK",
  "Manchester, UK",
  "Birmingham, UK",
  "Leeds, UK",
];

export function AddChallengeDialog() {
  const [open,        setOpen]        = useState(false);
  const [institution, setInstitution] = useState("");
  const [name,        setName]        = useState("");
  const [dateOfEvent, setDateOfEvent] = useState<Date | undefined>(undefined);
  const [location,    setLocation]    = useState("");
  const [price,       setPrice]       = useState("");
  const [cap,         setCap]         = useState("");

  function handleClose() {
    setOpen(false);
    setInstitution("");
    setName("");
    setDateOfEvent(undefined);
    setLocation("");
    setPrice("");
    setCap("");
  }

  return (
    <>
      <Button
        className="gap-1.5 bg-[#EC8900] text-white font-bold hover:bg-[#d47800] whitespace-nowrap"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        New Challenges
      </Button>

      <Dialog open={open} onOpenChange={val => { if (!val) handleClose(); else setOpen(true); }}>
        <DialogContent showCloseButton={false} className="sm:max-w-lg gap-0 px-8 py-8">

          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <DialogTitle className="text-xl font-bold text-[#161616]">
              Add New Challenge
            </DialogTitle>
            <button
              onClick={handleClose}
              className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Institutions */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Institutions</label>
              <Select value={institution} onValueChange={v => { if (v) setInstitution(v); }}>
                <SelectTrigger className="h-11 w-full rounded-lg border border-gray-200 text-sm">
                  <SelectValue placeholder="Select institution" />
                </SelectTrigger>
                <SelectContent>
                  {INSTITUTIONS.map(inst => (
                    <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Challenge name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Challenge name</label>
              <Input
                placeholder="Running with passion in mind"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 text-sm"
              />
            </div>

            {/* Date of event */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Date of event</label>
              <DateTimePicker
                value={dateOfEvent}
                onChange={setDateOfEvent}
                placeholder="Pick a date & time"
              />
            </div>

            {/* Pickup location */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Pickup location</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Select value={location} onValueChange={v => { if (v) setLocation(v); }}>
                  <SelectTrigger className="h-11 w-full rounded-lg border border-gray-200 text-sm pl-9">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price + Cap */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Price ($)</label>
                <Input
                  type="number"
                  placeholder="120"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Cap</label>
                <Input
                  type="number"
                  placeholder="200"
                  value={cap}
                  onChange={e => setCap(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6 h-12 bg-[#EC8900] hover:bg-[#d47800] text-white font-bold text-sm rounded-xl"
            onClick={handleClose}
          >
            Add New Challenge
          </Button>

        </DialogContent>
      </Dialog>
    </>
  );
}
