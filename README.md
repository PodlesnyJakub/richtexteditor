# @jpo/richtext-editor

A paginated React rich text editor built on [Tiptap](https://tiptap.dev/) and ProseMirror. Renders A4/Letter page breaks while editing — similar to Google Docs — with preview mode and PDF export.

## Features

- **Paginated editing** — visual page breaks with shadows, gaps, and page numbers
- **Full formatting** — bold, italic, underline, strikethrough, code, headings (H1–H4), blockquotes, code blocks, horizontal rules
- **Lists** — bullet and ordered
- **Text alignment** — left, center, right, justify
- **Colors** — text color and multi-color highlight
- **Font size** — dropdown with common sizes
- **Tables** — resizable columns, header rows
- **Images** — insert via URL or file upload, resizable with drag handles
- **Links** — insert/edit dialog, opens in new tab
- **Drag & drop** — reorder blocks with a grip handle
- **Undo/Redo** — full history support
- **PDF export** — programmatic (html2canvas + jsPDF) or native `window.print()`
- **Preview mode** — read-only paginated view
- **Document protection** — prevents accidental deletion of the entire document

## Installation

```bash
npm install @jpo/richtext-editor
```

Peer dependencies: `react` and `react-dom` (v18 or v19).

## Quick Start

```tsx
import { useRef } from 'react';
import { RichTextEditor } from '@jpo/richtext-editor';
import '@jpo/richtext-editor/styles.css';

function App() {
  const editorRef = useRef(null);

  return (
    <RichTextEditor
      ref={editorRef}
      initialContent="<p>Hello world</p>"
      onChange={(html, json) => console.log(html)}
      placeholder="Start typing..."
      pageFormat="a4"
      pagination
    />
  );
}
```

## API

### `<RichTextEditor>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | `string` | `'<p></p>'` | Initial HTML content |
| `onChange` | `(html, json) => void` | — | Called on every content change |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text |
| `pageFormat` | `'a4' \| 'letter'` | `'a4'` | Page format for pagination |
| `pagination` | `boolean` | `true` | Enable visual page breaks |
| `className` | `string` | — | Additional CSS class for the wrapper |

### Ref methods

Access via `ref`:

```tsx
const editorRef = useRef<RichTextEditorRef>(null);

// Get content
editorRef.current.getHTML();       // → string
editorRef.current.getJSON();       // → JSONContent

// PDF
editorRef.current.exportPdf();     // → Promise<Blob>
editorRef.current.print();         // → opens print dialog

// Info
editorRef.current.getPageCount();  // → number
editorRef.current.getEditor();     // → Tiptap Editor instance
```

### `<PreviewMode>`

Read-only paginated view of HTML content.

```tsx
import { PreviewMode } from '@jpo/richtext-editor';
import '@jpo/richtext-editor/styles.css';

<PreviewMode
  content={html}
  pageFormat="a4"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | — | HTML content to preview |
| `pageFormat` | `'a4' \| 'letter'` | `'a4'` | Page format |
| `className` | `string` | — | Additional CSS class |

## PDF Export

Two methods:

**Programmatic** — renders pages off-screen with `html2canvas` and assembles into a PDF with `jsPDF`. These dependencies are dynamically imported so they don't affect your main bundle size.

```ts
const blob = await editorRef.current.exportPdf();
const url = URL.createObjectURL(blob);
// download or display
```

**Native print** — opens the browser print dialog. CSS `@page` and `@media print` rules handle pagination.

```ts
editorRef.current.print();
```

## Development

```bash
# Install dependencies
npm install

# Start dev playground
npm run dev

# Build library
npm run build
```

The playground at `http://localhost:5173` loads a sample document with all features enabled.

## How Pagination Works

The editor uses a single continuous Tiptap editor instance. A custom ProseMirror plugin (`PaginationPlugin`) calculates page breaks:

1. After every document change (debounced), iterates top-level nodes
2. Measures each node's height via `getBoundingClientRect()`
3. Tracks cumulative height per page against usable page height (page height minus margins)
4. When a node would overflow, inserts a `Decoration.widget` before it
5. The widget renders a visual page break: bottom margin → paper edge shadow → gray gap with page number → paper edge shadow → top margin

Key properties:
- **No document model changes** — page breaks are purely visual decorations
- **Never pollutes undo** — all recalculation transactions use `setMeta('addToHistory', false)`
- **Responsive to layout changes** — `ResizeObserver` catches image loads, resizes, etc.

## License

MIT
