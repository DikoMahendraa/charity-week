"use client";

import { useState } from "react";
import { X, MapPin } from "lucide-react";
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

interface Props {
  challengeName:     string;
  initialInstitution?: string;
  initialDate?:      Date;
  initialLocation?:  string;
  initialPrice?:     string;
  initialCap?:       string;
  triggerLabel?:     string;
  triggerSize?:      "sm" | "default" | "lg";
  triggerClassName?: string;
  triggerVariant?:   "outline" | "default" | "ghost";
}

export function EditChallengeDialog({
  challengeName,
  initialInstitution = "",
  initialDate,
  initialLocation    = "",
  initialPrice       = "",
  initialCap         = "",
  triggerLabel       = "Edit Challenge",
  triggerSize        = "default",
  triggerClassName   = "border-[#EC8900] text-[#EC8900] hover:bg-orange-50 font-semibold",
  triggerVariant     = "outline",
}: Props) {
  const [open,        setOpen]        = useState(false);
  const [institution, setInstitution] = useState(initialInstitution);
  const [name,        setName]        = useState(challengeName);
  const [dateOfEvent, setDateOfEvent] = useState<Date | undefined>(initialDate);
  const [location,    setLocation]    = useState(initialLocation);
  const [price,       setPrice]       = useState(initialPrice);
  const [cap,         setCap]         = useState(initialCap);

  function handleOpen() {
    setInstitution(initialInstitution);
    setName(challengeName);
    setDateOfEvent(initialDate);
    setLocation(initialLocation);
    setPrice(initialPrice);
    setCap(initialCap);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSave() {
    // TODO: wire to API
    handleClose();
  }

  return (
    <>
      <Button
        variant={triggerVariant}
        size={triggerSize}
        onClick={handleOpen}
        className={triggerClassName}
      >
        {triggerLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-lg gap-0 px-8 py-8">

          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <DialogTitle className="text-xl font-bold text-[#161616]">
              Edit &#8211; {challengeName}
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
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Cap</label>
                <Input
                  type="number"
                  value={cap}
                  onChange={e => setCap(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="mt-6 h-12 w-full bg-[#EC8900] text-sm font-bold text-white hover:bg-[#d47800] rounded-xl"
          >
            Save Changes
          </Button>

        </DialogContent>
      </Dialog>
    </>
  );
}
