import type { Editor, JSONContent } from '@tiptap/core';

export type PageFormat = 'a4' | 'letter';

export interface PageDimensions {
  /** Width in pixels at 96 DPI */
  width: number;
  /** Height in pixels at 96 DPI */
  height: number;
  /** Margins in pixels */
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface RichTextEditorProps {
  /** Initial HTML content */
  initialContent?: string;
  /** Called on every content change */
  onChange?: (html: string, json: JSONContent) => void;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Page format for pagination */
  pageFormat?: PageFormat;
  /** Enable visual pagination */
  pagination?: boolean;
  /** Additional CSS class for the outer wrapper */
  className?: string;
}

export interface RichTextEditorRef {
  /** Get current content as HTML */
  getHTML: () => string;
  /** Get current content as JSON */
  getJSON: () => JSONContent;
  /** Export content as PDF (programmatic) */
  exportPdf: () => Promise<Blob>;
  /** Open browser print dialog */
  print: () => void;
  /** Get current page count */
  getPageCount: () => number;
  /** Access underlying Tiptap editor */
  getEditor: () => Editor | null;
}

export interface PreviewModeProps {
  /** HTML content to preview */
  content: string;
  /** Page format */
  pageFormat?: PageFormat;
  /** Additional CSS class */
  className?: string;
}
