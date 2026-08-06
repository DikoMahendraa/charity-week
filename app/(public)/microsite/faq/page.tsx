"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Render } from "@puckeditor/core";
import { puckConfig } from "@/lib/cms/config";
import { loadPublished } from "@/lib/cms/storage";
import type { Data } from "@puckeditor/core";

function EmptyState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F7F9FB] text-center px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF2DF]">
        <span className="text-3xl">🏗️</span>
      </div>
      <h1 className="text-xl font-bold text-[#161616]">FAQ page not published yet</h1>
      <p className="text-sm text-gray-400 max-w-xs">
        Select the "FAQ" tab in the CMS, build your page with blocks, then click Save Changes.
      </p>
      <Link
        href="/site/cms"
        className="mt-2 rounded-full bg-[#EC8900] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d47a00] transition-colors"
      >
        Open Page Builder
      </Link>
    </div>
  );
}

export default function FaqPage() {
  const [data, setData] = useState<Data | null | undefined>(undefined);

  useEffect(() => {
    const published = loadPublished("faq");
    setData(published && published.content.length > 0 ? published : null);
  }, []);

  if (data === undefined) return null;
  if (data === null) return <EmptyState />;

  return <Render config={puckConfig} data={data} />;
}
