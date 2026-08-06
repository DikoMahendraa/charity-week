"use client";

import { useEffect, useState } from "react";

export interface SharePageInfo {
  id: number;
  title: string;
  image: string;
  location: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  page: SharePageInfo | null;
}

export default function ShareWithFriendsSheet({ open, onClose, page }: Props) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted || !page) return null;

  const pageUrl = `https://charityweek.com/my-page-${page.id}`;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedMsg = encodeURIComponent(`Support me - ${pageUrl}`);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silently ignore */ }
  }

  const buttons = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedMsg}`,
      bg: "bg-[#25D366]",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.522 5.83L.058 23.268a.748.748 0 0 0 .916.916l5.44-1.463A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.063-1.382l-.362-.215-3.233.87.884-3.232-.236-.375A9.884 9.884 0 0 1 2.1 12c0-5.463 4.437-9.9 9.9-9.9 5.463 0 9.9 4.437 9.9 9.9 0 5.463-4.437 9.9-9.9 9.9z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: "bg-[#1877F2]",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      ),
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedMsg}`,
      bg: "bg-black",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.742l7.736-8.849L1.254 2.25H8.08l4.26 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    /* z-[60] so it sits above the parent SharePagesBottomSheet (z-50) */
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop - lighter since parent sheet is still visible behind */}
      <div
        className="absolute inset-0 bg-black/30 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-[430px] rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-bold text-gray-900">Share with friends</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-8 pt-4">
          {/* Page preview card */}
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
              <img src={page.image} alt={page.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">{page.title}</p>
              <p className="text-xs text-gray-400">{page.location} • by IRUK</p>
            </div>
          </div>

          {/* Share via icons */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Share via</p>
          <div className="mb-5 flex items-start justify-between">
            {buttons.map(btn => (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5"
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-full ${btn.bg} shadow-sm transition-opacity hover:opacity-85`}>
                  {btn.icon}
                </span>
                <span className="text-xs text-gray-500">{btn.label}</span>
              </a>
            ))}

            {/* Copy Link icon */}
            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-1.5"
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition-all ${copied ? "bg-green-500" : "bg-gray-100 hover:bg-gray-200"}`}>
                {copied ? (
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path strokeLinecap="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                )}
              </span>
              <span className="text-xs text-gray-500">Copy Link</span>
            </button>
          </div>

          {/* URL bar + Copy button */}
          <div className="flex items-center overflow-hidden rounded-xl bg-gray-100">
            <span className="flex-1 truncate px-4 py-3 text-sm text-gray-400">{pageUrl}</span>
            <button
              onClick={handleCopy}
              className={`shrink-0 px-4 py-3 text-sm font-bold transition-colors ${copied ? "text-green-600" : "text-[#EC8900] hover:text-[#d47a00]"
                }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
