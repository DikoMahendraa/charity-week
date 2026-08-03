"use client";

import { useState, useEffect } from "react";
import {
  Puck, Drawer, usePuck,
  type Data,
} from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Globe, GripVertical, Search,
  ChevronDown, ChevronRight,
  LayoutTemplate, Columns2, Zap,
  Heart, BookOpen, HelpCircle, Type,
  Images, Video, Eye, Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { puckConfig, EMPTY_DATA } from "@/lib/cms/config";
import { loadDraft, saveDraft, savePublished } from "@/lib/cms/storage";

// ─── Orange theme — overrides Puck's azure scale ─────────────────────────────
const PUCK_ORANGE_VARS: React.CSSProperties = {
  "--puck-color-azure-01": "#5C3300",
  "--puck-color-azure-02": "#8A4D00",
  "--puck-color-azure-03": "#B86600",
  "--puck-color-azure-04": "#EC8900",
  "--puck-color-azure-05": "#F5A623",
  "--puck-color-azure-06": "#F9BE5C",
  "--puck-color-azure-07": "#FBD08A",
  "--puck-color-azure-08": "#FDE0B0",
  "--puck-color-azure-09": "#FEECD0",
  "--puck-color-azure-10": "#FEF4E0",
  "--puck-color-azure-11": "#FEF8EF",
  "--puck-color-azure-12": "#FFFDF8",
  "--puck-radius-m":       "6px",
  "--puck-radius-l":       "10px",
} as React.CSSProperties;

// ─── Component definitions ───────────────────────────────────────────────────

type ComponentDef = {
  name:     string;
  label:    string;
  category: "LAYOUT" | "CONTENT" | "MEDIA";
  icon:     React.ElementType;
};

const COMPONENT_DEFS: ComponentDef[] = [
  // LAYOUT
  { name: "HeroBanner",     label: "Hero Banner",      category: "LAYOUT",  icon: LayoutTemplate },
  { name: "CTASection",     label: "CTA Section",      category: "LAYOUT",  icon: Zap            },
  { name: "TwoColumnCards", label: "Two-Column Cards",  category: "LAYOUT",  icon: Columns2       },
  // CONTENT
  { name: "DonationWidget", label: "Donation Widget",  category: "CONTENT", icon: Heart          },
  { name: "ImpactStories",  label: "Impact Stories",   category: "CONTENT", icon: BookOpen       },
  { name: "FAQSection",     label: "FAQ Section",      category: "CONTENT", icon: HelpCircle     },
  { name: "RichTextBlock",  label: "Rich Text Block",  category: "CONTENT", icon: Type           },
  // MEDIA
  { name: "ImageGallery",   label: "Image Gallery",    category: "MEDIA",   icon: Images         },
  { name: "VideoEmbed",     label: "Video Embed",      category: "MEDIA",   icon: Video          },
];

const CATEGORIES: Array<ComponentDef["category"]> = ["LAYOUT", "CONTENT", "MEDIA"];

// ─── Custom drawer item (uses Puck context for click-to-insert) ───────────────

const ROOT_ZONE = "root:default-zone";

function DrawerComponentItem({ comp, index }: { comp: ComponentDef; index: number }) {
  const { dispatch, appState } = usePuck();
  const Icon = comp.icon;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type:             "insert",
      componentType:    comp.name,
      destinationIndex: appState.data.content.length,
      destinationZone:  ROOT_ZONE,
    } as Parameters<typeof dispatch>[0]);
  };

  return (
    <Drawer.Item name={comp.name} index={index} label={comp.label}>
      {() => (
        <div className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[#FFF8EE] cursor-grab active:cursor-grabbing mb-0.5 select-none">
          <GripVertical className="h-3.5 w-3.5 shrink-0 text-gray-300" />
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1C1C1C]">
            <Icon className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="flex-1 text-xs font-medium text-[#3C3C3B]">{comp.label}</span>
          <button
            onClick={handleAdd}
            title="Add to canvas"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#EC8900] text-white text-xs font-bold opacity-0 transition-opacity group-hover:opacity-100"
          >
            +
          </button>
        </div>
      )}
    </Drawer.Item>
  );
}

// ─── Custom drawer panel ──────────────────────────────────────────────────────

function CustomDrawer() {
  const [search, setSearch]       = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const filtered = COMPONENT_DEFS.filter((c) =>
    !search || c.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategory = (cat: string) =>
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-100">
      <div className="px-4 pb-3 pt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#A1A1A1]">Components</p>
      </div>

      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-xs text-gray-700 placeholder:text-gray-400 focus:border-[#EC8900] focus:outline-none focus:ring-1 focus:ring-[#EC8900]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {CATEGORIES.map((cat) => {
          const items = filtered.filter((c) => c.category === cat);
          if (items.length === 0) return null;
          const isOpen = !collapsed[cat];

          return (
            <div key={cat} className="mb-3">
              <button
                onClick={() => toggleCategory(cat)}
                className="flex w-full items-center justify-between px-1 py-1 mb-1"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1A1]">
                  {cat}
                </span>
                {isOpen
                  ? <ChevronDown className="h-3 w-3 text-gray-400" />
                  : <ChevronRight className="h-3 w-3 text-gray-400" />
                }
              </button>

              {isOpen && (
                <Drawer droppableId={cat}>
                  {items.map((comp) => {
                    const globalIndex = COMPONENT_DEFS.indexOf(comp);
                    return <DrawerComponentItem key={comp.name} comp={comp} index={globalIndex} />;
                  })}
                </Drawer>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CMS page list ────────────────────────────────────────────────────────────

interface CmsPageEntry {
  id:    string;
  label: string;
  slug:  string;
  data:  Data;
}

const INITIAL_PAGES: CmsPageEntry[] = [
  { id: "home",  label: "Home",     slug: "/",      data: EMPTY_DATA },
  { id: "about", label: "About Us", slug: "/about", data: EMPTY_DATA },
  { id: "faq",   label: "FAQ",      slug: "/faq",   data: EMPTY_DATA },
];

// ─── CMS Page ─────────────────────────────────────────────────────────────────

export default function CmsPage() {
  const router                  = useRouter();
  const [pages, setPages]       = useState<CmsPageEntry[]>(INITIAL_PAGES);
  const [activeId, setActiveId] = useState("home");
  const [saved, setSaved]       = useState(false);

  // Load drafts from localStorage after mount
  useEffect(() => {
    setPages((prev) =>
      prev.map((p) => ({ ...p, data: loadDraft(p.id) ?? p.data }))
    );
  }, []);

  const activePage = pages.find((p) => p.id === activeId) ?? pages[0];

  const handleChange = (data: Data) => {
    setPages((prev) => prev.map((p) => (p.id === activeId ? { ...p, data } : p)));
    saveDraft(activeId, data);
  };

  const handlePublish = (data: Data) => {
    setPages((prev) => prev.map((p) => (p.id === activeId ? { ...p, data } : p)));
    savePublished(activeId, data);
  };

  const handleSave = () => {
    const page = pages.find((p) => p.id === activeId) ?? pages[0];
    const payload = {
      pageId: page.id,
      slug:   page.slug,
      label:  page.label,
      data:   page.data,
    };
    console.log("[CMS] Save payload →", payload);
    saveDraft(activeId, page.data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50"
      style={PUCK_ORANGE_VARS}
    >
      <Puck
        key={activeId}
        config={puckConfig}
        data={activePage.data}
        onChange={handleChange}
        onPublish={handlePublish}
        headerTitle={activePage.label}
        headerPath={activePage.slug}
        iframe={{ enabled: false }}
        overrides={{
          header: ({ actions }) => (
            <div className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6">
              {/* Left — back button + brand + page tabs */}
              <div className="flex items-center gap-5">
                <button
                  onClick={() => router.push("/campaign/institutions")}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#A1A1A1] transition-colors hover:bg-gray-100 hover:text-[#3C3C3B]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Dashboard
                </button>

                <div className="h-4 w-px bg-gray-200" />

                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#EC8900]" />
                  <span className="text-sm font-bold text-[#161616]">Site CMS</span>
                </div>

                <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-1">
                  {pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => setActiveId(page.id)}
                      className={cn(
                        "rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors",
                        activeId === page.id
                          ? "bg-white text-[#EC8900] shadow-sm"
                          : "text-[#A1A1A1] hover:text-gray-600"
                      )}
                    >
                      {page.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right — Save + Preview + Puck publish/undo actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    saved
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-[#EC8900] text-white hover:bg-[#D97B00]"
                  )}
                >
                  <Save className="h-3.5 w-3.5" />
                  {saved ? "Saved!" : "Save Changes"}
                </button>
                <button
                  onClick={() => window.open(`/preview/${activeId}`, "_blank")}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:border-gray-300"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
                {actions}
              </div>
            </div>
          ),
          drawer: () => <CustomDrawer />,
        }}
      />
    </div>
  );
}
