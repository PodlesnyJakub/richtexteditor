import React, { useRef, useState } from 'react';
import { RichTextEditor } from '../src/editor/RichTextEditor';
import { PreviewMode } from '../src/preview/PreviewMode';
import type { RichTextEditorRef } from '../src/types';

const SAMPLE_CONTENT = `
<h1>Welcome to the Rich Text Editor</h1>
<p>This is a paginated editor built with <strong>Tiptap</strong> and <strong>ProseMirror</strong>. It simulates A4 page breaks while you type, similar to Google Docs.</p>
<h2>Features</h2>
<ul>
  <li><strong>Bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, and <code>inline code</code></li>
  <li>Headings (H1–H4), paragraphs, blockquotes, code blocks</li>
  <li>Bullet and ordered lists</li>
  <li>Text alignment: left, center, right, justify</li>
  <li>Text color and highlight</li>
  <li>Font size control</li>
  <li>Links and images (resizable)</li>
  <li>Tables with resizable columns</li>
  <li>Undo/Redo with full history</li>
</ul>
<h2>Pagination</h2>
<p>The editor calculates page breaks based on the height of your content. When a block of content would overflow the current page, a visual page break is inserted. Try typing enough content to see it in action!</p>
<blockquote><p>This is a blockquote. It can contain <strong>formatted text</strong> and spans multiple lines if needed.</p></blockquote>
<h2>Try It Out</h2>
<p>Use the toolbar above to format your text. Click the "Preview" button to see a read-only paginated view, or "Export PDF" to generate a PDF file.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
<p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
`;

export default function App() {
  const editorRef = useRef<RichTextEditorRef>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [previewHtml, setPreviewHtml] = useState('');

  const handlePreview = () => {
    if (mode === 'edit') {
      const html = editorRef.current?.getHTML() ?? '';
      setPreviewHtml(html);
      setMode('preview');
    } else {
      setMode('edit');
    }
  };

  const handleExportPdf = async () => {
    try {
      const blob = await editorRef.current?.exportPdf();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  };

  const handlePrint = () => {
    editorRef.current?.print();
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <span style={{ fontWeight: 600, fontSize: 14, marginRight: 'auto' }}>
          @jpo/richtext-editor
        </span>
        <button onClick={handlePreview} style={btnStyle}>
          {mode === 'edit' ? 'Preview' : 'Back to Editor'}
        </button>
        <button onClick={handleExportPdf} style={btnStyle} disabled={mode !== 'edit'}>
          Export PDF
        </button>
        <button onClick={handlePrint} style={btnStyle}>
          Print
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {mode === 'edit' ? (
          <RichTextEditor
            ref={editorRef}
            initialContent={SAMPLE_CONTENT}
            placeholder="Start typing..."
            pageFormat="a4"
            pagination
            onChange={(html) => {
              // you could save html here
            }}
          />
        ) : (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <PreviewMode content={previewHtml} pageFormat="a4" />
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '6px 14px',
  border: '1px solid #d0d0d0',
  borderRadius: 4,
  background: '#fff',
  cursor: 'pointer',
  fontSize: 13,
};
