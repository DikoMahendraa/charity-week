"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
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

const institutionTypes = [
  "Schools",
  "University societies",
  "Masjids",
  "Organisations",
];

const regionOptions = [
  "Indonesia",
  "London",
  "Manchester",
  "Birmingham",
  "Leeds",
];

export function AddInstitutionDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>(["London", "Universities", "Schools"]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const trimmed = tagInput.trim().replace(/,$/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setName("");
      setType(null);
      setRegion(null);
      setTags(["London", "Universities", "Schools"]);
      setTagInput("");
    }
    setOpen(val);
  };

  return (
    <>
      <Button
        className="gap-1.5 bg-[#EC8900] text-white font-bold hover:bg-[#d47800]"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Add New Institutions
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          showCloseButton={true}
          className="sm:max-w-lg px-8 py-8 gap-0"
        >
          <DialogTitle className="text-xl font-bold text-[#161616] mb-6">
            Add New Institutions
          </DialogTitle>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Institutions name
              </label>
              <Input
                placeholder="South London School"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 text-sm"
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Institutions type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger size="lg" className="w-full rounded-lg border border-gray-200 text-sm">
                  <SelectValue placeholder="Schools" />
                </SelectTrigger>
                <SelectContent>
                  {institutionTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Regions
              </label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger size="lg" className="w-full rounded-lg border border-gray-200 text-sm">
                  <SelectValue placeholder="London" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Tags</label>
              <div className="flex flex-wrap items-center gap-1.5 min-h-11 rounded-lg border border-gray-200 px-3 py-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[#FFF2DF] px-2.5 py-0.5 text-xs font-medium text-[#EC8900]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-orange-900 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  placeholder="Type a new tags here.."
                  className="flex-1 min-w-24 text-xs outline-none placeholder:text-gray-400 bg-transparent"
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6 h-12 bg-[#EC8900] hover:bg-[#d47800] text-white font-bold text-sm"
            onClick={() => handleClose(false)}
          >
            Add New Institutions
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
