"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Render } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import type { Data } from "@puckeditor/core";
import { puckConfig, EMPTY_DATA } from "@/lib/cms/config";
import { loadDraft } from "@/lib/cms/storage";
import { ArrowLeft, Edit3 } from "lucide-react";

const PAGE_LABELS: Record<string, string> = {
  home:  "Home",
  about: "About Us",
  faq:   "FAQ",
};

export default function PreviewPage() {
  const params   = useParams();
  const router   = useRouter();
  const pageId   = typeof params.pageId === "string" ? params.pageId : (params.pageId?.[0] ?? "home");
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    setData(loadDraft(pageId) ?? EMPTY_DATA);
  }, [pageId]);

  if (data === null) return null;

  const label = PAGE_LABELS[pageId] ?? pageId;
  const isEmpty = data.content.length === 0;

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Preview banner */}
      <div style={{
        position:       "sticky",
        top:            0,
        zIndex:         50,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "0 24px",
        height:         "48px",
        background:     "#1C1C1C",
        color:          "#fff",
        fontSize:       "0.8rem",
        gap:            "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "#EC8900", color: "#fff", borderRadius: "4px", padding: "2px 8px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em" }}>
            PREVIEW
          </span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>You're previewing the draft of</span>
          <span style={{ fontWeight: 600 }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => router.push("/site/cms")}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "6px", color: "#fff", padding: "6px 12px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
          >
            <Edit3 style={{ width: 12, height: 12 }} />
            Back to Editor
          </button>
          <button
            onClick={() => window.close()}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "rgba(255,255,255,0.6)", padding: "6px 10px", fontSize: "0.75rem", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Rendered page */}
      {isEmpty ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 48px)", gap: "12px", color: "#A1A1A1" }}>
          <span style={{ fontSize: "3rem" }}>📄</span>
          <p style={{ fontWeight: 600, color: "#3C3C3B" }}>This page has no content yet</p>
          <p style={{ fontSize: "0.875rem" }}>Go back to the editor and add some blocks.</p>
          <button
            onClick={() => router.push("/site/cms")}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "#EC8900", border: "none", borderRadius: "8px", color: "#fff", padding: "10px 20px", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", marginTop: "8px" }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Open Editor
          </button>
        </div>
      ) : (
        <Render config={puckConfig} data={data} />
      )}
    </div>
  );
}
