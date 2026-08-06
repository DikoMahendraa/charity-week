"use client";

import { useState } from "react";
import { X } from "lucide-react";
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

const INSTITUTION_TYPES = ["Schools", "University societies", "Masjids", "Organisations"];
const REGION_OPTIONS    = ["Indonesia", "London", "Manchester", "Birmingham", "Leeds"];

interface Props {
  institutionName: string;
  institutionType: string;
  region:          string;
  initialTags?:    string[];
  triggerLabel?:   string;
  triggerSize?:    "sm" | "default" | "lg";
  triggerClassName?: string;
}

export function EditInstitutionDialog({
  institutionName,
  institutionType,
  region,
  initialTags = ["London", "Universities", "Schools"],
  triggerLabel    = "Edit Details",
  triggerSize     = "default",
  triggerClassName = "border-[#EC8900] text-[#EC8900] hover:bg-orange-50 font-semibold",
}: Props) {
  const [open, setOpen] = useState(false);

  // Form state — reset to props on each open
  const [name,     setName]     = useState(institutionName);
  const [type,     setType]     = useState(institutionType);
  const [rgn,      setRgn]      = useState(region);
  const [tags,     setTags]     = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState("");

  function handleOpen() {
    // Reset to current props when opening
    setName(institutionName);
    setType(institutionType);
    setRgn(region);
    setTags(initialTags);
    setTagInput("");
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function addTag() {
    const trimmed = tagInput.trim().replace(/,$/, "");
    if (trimmed && !tags.includes(trimmed)) setTags(prev => [...prev, trimmed]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  }

  function handleSave() {
    // TODO: wire to API
    handleClose();
  }

  return (
    <>
      <Button
        variant="outline"
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
              Edit &#8211; {institutionName}
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
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Institutions name</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-200 text-sm"
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Institutions type</label>
              <Select value={type} onValueChange={v => { if (v) setType(v); }}>
                <SelectTrigger size="lg" className="w-full rounded-lg border border-gray-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INSTITUTION_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Regions</label>
              <Select value={rgn} onValueChange={v => { if (v) setRgn(v); }}>
                <SelectTrigger size="lg" className="w-full rounded-lg border border-gray-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGION_OPTIONS.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Tags</label>
              <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-[#EC8900]/30 bg-[#FFF2DF] px-2.5 py-0.5 text-xs font-medium text-[#EC8900]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-orange-900 transition-colors"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  placeholder="Type a new tags here.."
                  className="min-w-24 flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <Button
            onClick={handleSave}
            className="mt-6 h-12 w-full bg-[#EC8900] text-sm font-bold text-white hover:bg-[#d47800]"
          >
            Save Changes
          </Button>

        </DialogContent>
      </Dialog>
    </>
  );
}
