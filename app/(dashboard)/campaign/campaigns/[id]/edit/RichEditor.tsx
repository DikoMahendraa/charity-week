"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useRef } from "react";
import {
  Bold, Italic, UnderlineIcon, Heading2, Heading3,
  Quote, Link2, ImageIcon, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Unlink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolBtn({
  onClick, active, title, children,
}: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800",
        active && "bg-orange-100 text-[#EC8900]"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-gray-200" />;
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function Toolbar({ editor, onImageInsert }: { editor: Editor; onImageInsert: () => void }) {
  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL:", prev ?? "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 px-2 py-1.5">
      {/* Text style */}
      <ToolBtn title="Bold"      onClick={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive("bold")}>
        <Bold className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn title="Italic"    onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive("italic")}>
        <Italic className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
        <UnderlineIcon className="h-3.5 w-3.5" />
      </ToolBtn>

      <Divider />

      {/* Headings */}
      <ToolBtn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
        <Heading2 className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
        <Heading3 className="h-3.5 w-3.5" />
      </ToolBtn>

      <Divider />

      {/* Alignment */}
      <ToolBtn title="Align left"    onClick={() => editor.chain().focus().setTextAlign("left").run()}    active={editor.isActive({ textAlign: "left" })}>
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn title="Align center"  onClick={() => editor.chain().focus().setTextAlign("center").run()}  active={editor.isActive({ textAlign: "center" })}>
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn title="Align right"   onClick={() => editor.chain().focus().setTextAlign("right").run()}   active={editor.isActive({ textAlign: "right" })}>
        <AlignRight className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn title="Justify"       onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })}>
        <AlignJustify className="h-3.5 w-3.5" />
      </ToolBtn>

      <Divider />

      {/* Lists */}
      <ToolBtn title="Bullet list"   onClick={() => editor.chain().focus().toggleBulletList().run()}   active={editor.isActive("bulletList")}>
        <List className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn title="Ordered list"  onClick={() => editor.chain().focus().toggleOrderedList().run()}  active={editor.isActive("orderedList")}>
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn title="Blockquote"    onClick={() => editor.chain().focus().toggleBlockquote().run()}    active={editor.isActive("blockquote")}>
        <Quote className="h-3.5 w-3.5" />
      </ToolBtn>

      <Divider />

      {/* Link */}
      <ToolBtn title="Add link"   onClick={setLink}                                                active={editor.isActive("link")}>
        <Link2 className="h-3.5 w-3.5" />
      </ToolBtn>
      {editor.isActive("link") && (
        <ToolBtn title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()} active={false}>
          <Unlink className="h-3.5 w-3.5" />
        </ToolBtn>
      )}

      {/* Image */}
      <ToolBtn title="Insert image" onClick={onImageInsert} active={false}>
        <ImageIcon className="h-3.5 w-3.5" />
      </ToolBtn>
    </div>
  );
}

// ─── Editor ──────────────────────────────────────────────────────────────────

export function RichEditor({ placeholder = "Write your story here…" }: { placeholder?: string }) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#EC8900] underline" } }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[200px] px-4 py-3 text-sm text-gray-700 outline-none prose prose-sm max-w-none focus:outline-none",
      },
    },
  });

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 focus-within:border-[#EC8900] focus-within:ring-1 focus-within:ring-[#EC8900]/30 transition-colors">
      <Toolbar editor={editor} onImageInsert={() => imageInputRef.current?.click()} />
      <EditorContent editor={editor} />

      {/* Hidden image file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />

      {/* Placeholder text (CSS-driven for ProseMirror) */}
      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: "${placeholder}";
          color: #9ca3af;
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
