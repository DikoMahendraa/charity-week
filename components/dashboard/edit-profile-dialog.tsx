"use client";

import { useState, useRef } from "react";
import { X, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  initialFirstName?: string;
  initialLastName?:  string;
  initialEmail?:     string;
  initialPhone?:     string;
  initialAvatar?:    string;
  triggerLabel?:     string;
  triggerClassName?: string;
}

// Simple status badge shown inline inside an input row
function Available({ label = "available" }: { label?: string }) {
  return (
    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#14BA6D]">
      <Check className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function EditProfileDialog({
  initialFirstName = "Aissha",
  initialLastName  = "Fatmawati",
  initialEmail     = "aissshaa@gmail.com",
  initialPhone     = "",
  initialAvatar    = "",
  triggerLabel     = "Edit Profile",
  triggerClassName = "border-white bg-white text-[#EC8900] font-semibold hover:bg-orange-50 rounded-lg",
}: Props) {
  const [open, setOpen] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName,  setLastName]  = useState(initialLastName);
  const [email,     setEmail]     = useState(initialEmail);
  const [phone,     setPhone]     = useState(initialPhone);
  const [url1,      setUrl1]      = useState("");
  const [url2,      setUrl2]      = useState("");
  const [avatar,    setAvatar]    = useState(initialAvatar);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  function handleOpen() {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setEmail(initialEmail);
    setPhone(initialPhone);
    setUrl1("");
    setUrl2("");
    setAvatar(initialAvatar);
    setOpen(true);
  }

  function handleClose() { setOpen(false); }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
    e.target.value = "";
  }

  function handleSave() {
    // TODO: wire to API
    handleClose();
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpen}
        className={triggerClassName}
      >
        {triggerLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-lg gap-0 px-8 py-8">

          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Edit your Profile
            </DialogTitle>
            <button
              onClick={handleClose}
              className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Avatar */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md">
              {avatar ? (
                <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#EC8900] text-2xl font-bold text-white">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="rounded-lg bg-[#EC8900] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d47800] transition-colors"
            >
              Change photo
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="space-y-4">
            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">First name</label>
                <Input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="h-11 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Last name</label>
                <Input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="h-11 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Email</label>
              <div className="flex h-11 items-center gap-2 rounded-lg border border-gray-200 px-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                />
                {email && <Available label="Email available" />}
              </div>
            </div>

            {/* Phone number */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Phone number</label>
              <div className="flex h-11 items-center overflow-hidden rounded-lg border border-gray-200">
                {/* Country selector */}
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-1.5 border-r border-gray-100 bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100 transition-colors h-full"
                >
                  <span className="text-base leading-none">🇬🇧</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {/* Code */}
                <span className="border-r border-gray-100 px-3 text-sm text-gray-500 shrink-0">+44</span>
                {/* Number input */}
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="flex-1 bg-transparent px-3 text-sm text-gray-700 outline-none placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Custom URLs */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-900">Custom URLs</p>

              {/* URL row 1 */}
              <div className="flex h-11 items-center overflow-hidden rounded-lg border border-gray-200">
                <span className="shrink-0 border-r border-gray-100 bg-gray-50 px-3 text-xs text-gray-400 whitespace-nowrap h-full flex items-center">
                  grt.amanahfy.com/
                </span>
                <input
                  type="text"
                  value={url1}
                  onChange={e => setUrl1(e.target.value)}
                  placeholder="Enter your URL"
                  className="flex-1 min-w-0 bg-transparent px-3 text-sm text-gray-700 outline-none placeholder:text-gray-300"
                />
                <div className="shrink-0 px-3">
                  <Available label="URL available" />
                </div>
              </div>

              {/* URL row 2 */}
              <div className="flex h-11 items-center overflow-hidden rounded-lg border border-gray-200">
                <span className="shrink-0 border-r border-gray-100 bg-gray-50 px-3 text-xs text-gray-400 whitespace-nowrap h-full flex items-center">
                  https://amanahfy.com/
                </span>
                <input
                  type="text"
                  value={url2}
                  onChange={e => setUrl2(e.target.value)}
                  placeholder="Enter your URL"
                  className="flex-1 min-w-0 bg-transparent px-3 text-sm text-gray-700 outline-none placeholder:text-gray-300"
                />
                <div className="shrink-0 px-3">
                  <Available label="URL available" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handleSave}
            className="mt-6 h-12 w-full rounded-xl bg-[#EC8900] text-sm font-bold text-white hover:bg-[#d47800]"
          >
            Customise my profile URL
          </Button>

        </DialogContent>
      </Dialog>
    </>
  );
}
