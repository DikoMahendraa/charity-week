import type { Data } from "@puckeditor/core";

const draftKey     = (id: string) => `cms:draft:${id}`;
const publishedKey = (id: string) => `cms:published:${id}`;

export function loadDraft(pageId: string): Data | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(draftKey(pageId));
    return raw ? (JSON.parse(raw) as Data) : null;
  } catch {
    return null;
  }
}

export function saveDraft(pageId: string, data: Data): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(draftKey(pageId), JSON.stringify(data));
}

export function loadPublished(pageId: string): Data | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(publishedKey(pageId));
    return raw ? (JSON.parse(raw) as Data) : null;
  } catch {
    return null;
  }
}

export function savePublished(pageId: string, data: Data): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(publishedKey(pageId), JSON.stringify(data));
  localStorage.setItem(draftKey(pageId), JSON.stringify(data));
}
