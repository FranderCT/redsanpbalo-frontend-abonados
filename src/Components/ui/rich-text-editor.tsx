/**
 * RichTextEditor — editor de texto enriquecido basado en Tiptap.
 * Produce y consume HTML. Compatible con shadcn/ui.
 */

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo2,
  Redo2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/Components/ui/separator";

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  className?: string;
};

// ── Botón de toolbar (sin Tooltip para evitar el Provider) ────────────────────

type TBtnProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

function TBtn({ onClick, active, disabled, title, children }: TBtnProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-40",
        active && "bg-accent text-accent-foreground",
      )}
      onMouseDown={(e) => {
        // Evita que el editor pierda el foco al hacer clic en la barra
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Escribe aquí…",
  minHeight = "8rem",
  disabled = false,
  className,
}: Props) {
  // Ref para evitar loop: onChange actualiza value → no reinicializar el editor
  const skipSync = useRef(false);

  const editor = useEditor({
    extensions: [
      // StarterKit v3 ya incluye: bold, italic, strike, underline, headings,
      // bulletList, orderedList, blockquote, code, codeBlock, hardBreak,
      // horizontalRule, paragraph, text, history
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false, // evita hidratación SSR/StrictMode
    onUpdate({ editor: e }) {
      skipSync.current = true;
      onChange?.(e.isEmpty ? "" : e.getHTML());
    },
  });

  // Sincronizar contenido externo (reset de formulario, carga inicial async)
  useEffect(() => {
    if (!editor) return;
    if (skipSync.current) {
      skipSync.current = false;
      return;
    }
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", false /* emitUpdate = false */);
    }
  }, [value, editor]);

  // Sincronizar disabled
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "rounded-md border bg-background text-sm ring-offset-background",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">

        {/* Formato */}
        <TBtn
          title="Negrita (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          disabled={disabled}
        >
          <Bold className="size-3.5" />
        </TBtn>

        <TBtn
          title="Cursiva (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          disabled={disabled}
        >
          <Italic className="size-3.5" />
        </TBtn>

        <TBtn
          title="Subrayado (Ctrl+U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          disabled={disabled}
        >
          <UnderlineIcon className="size-3.5" />
        </TBtn>

        <TBtn
          title="Tachado"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          disabled={disabled}
        >
          <Strikethrough className="size-3.5" />
        </TBtn>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Encabezados */}
        <TBtn
          title="Título 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          disabled={disabled}
        >
          <Heading1 className="size-3.5" />
        </TBtn>

        <TBtn
          title="Título 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
        >
          <Heading2 className="size-3.5" />
        </TBtn>

        <TBtn
          title="Título 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
        >
          <Heading3 className="size-3.5" />
        </TBtn>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Alineación */}
        <TBtn
          title="Alinear izquierda"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          disabled={disabled}
        >
          <AlignLeft className="size-3.5" />
        </TBtn>

        <TBtn
          title="Centrar"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          disabled={disabled}
        >
          <AlignCenter className="size-3.5" />
        </TBtn>

        <TBtn
          title="Alinear derecha"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          disabled={disabled}
        >
          <AlignRight className="size-3.5" />
        </TBtn>

        <TBtn
          title="Justificar"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          disabled={disabled}
        >
          <AlignJustify className="size-3.5" />
        </TBtn>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Listas */}
        <TBtn
          title="Lista con viñetas"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          disabled={disabled}
        >
          <List className="size-3.5" />
        </TBtn>

        <TBtn
          title="Lista numerada"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          disabled={disabled}
        >
          <ListOrdered className="size-3.5" />
        </TBtn>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Historial */}
        <TBtn
          title="Deshacer (Ctrl+Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
        >
          <Undo2 className="size-3.5" />
        </TBtn>

        <TBtn
          title="Rehacer (Ctrl+Y)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
        >
          <Redo2 className="size-3.5" />
        </TBtn>
      </div>

      {/* ── Área editable ────────────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        className={cn(
          // prose base
          "prose prose-sm max-w-none px-3 py-2",
          "prose-headings:font-semibold prose-h1:text-xl prose-h2:text-base prose-h3:text-sm",
          // foco del ProseMirror
          "[&_.ProseMirror]:outline-none",
          "[&_.ProseMirror]:min-h-[var(--rte-min-h)]",
          // placeholder (extensión lo inyecta como ::before en .is-editor-empty)
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
        )}
        style={{ "--rte-min-h": minHeight } as React.CSSProperties}
      />
    </div>
  );
}
