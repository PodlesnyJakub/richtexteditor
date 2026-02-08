import React, { useState, useCallback } from 'react';
import type { Editor } from '@tiptap/core';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarSelect } from './ToolbarSelect';
import { ColorPicker } from './ColorPicker';
import { LinkDialog } from './LinkDialog';
import { ImageDialog } from './ImageDialog';
import {
  BoldIcon, ItalicIcon, UnderlineIcon, StrikeIcon, CodeIcon,
  AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon,
  BulletListIcon, OrderedListIcon, BlockquoteIcon, CodeBlockIcon,
  HorizontalRuleIcon, LinkIcon, UnlinkIcon, ImageIcon, TableIcon,
  UndoIcon, RedoIcon, TextColorIcon, HighlightIcon,
} from './icons';

interface ToolbarProps {
  editor: Editor;
}

const HEADING_OPTIONS = [
  { value: '0', label: 'Normal' },
  { value: '1', label: 'Heading 1' },
  { value: '2', label: 'Heading 2' },
  { value: '3', label: 'Heading 3' },
  { value: '4', label: 'Heading 4' },
];

const FONT_SIZE_OPTIONS = [
  { value: '', label: 'Size' },
  { value: '10px', label: '10' },
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '24px', label: '24' },
  { value: '28px', label: '28' },
  { value: '32px', label: '32' },
  { value: '36px', label: '36' },
  { value: '48px', label: '48' },
];

export function Toolbar({ editor }: ToolbarProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const getCurrentHeading = useCallback((): string => {
    for (let i = 1; i <= 4; i++) {
      if (editor.isActive('heading', { level: i })) return String(i);
    }
    return '0';
  }, [editor]);

  const getCurrentFontSize = useCallback((): string => {
    return (editor.getAttributes('textStyle').fontSize as string) || '';
  }, [editor]);

  const handleHeadingChange = useCallback(
    (value: string) => {
      const level = parseInt(value, 10);
      if (level === 0) {
        editor.chain().focus().setParagraph().run();
      } else {
        editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
      }
    },
    [editor],
  );

  const handleFontSizeChange = useCallback(
    (value: string) => {
      if (value === '') {
        editor.chain().focus().unsetFontSize().run();
      } else {
        editor.chain().focus().setFontSize(value).run();
      }
    },
    [editor],
  );

  const handleLinkSubmit = useCallback(
    (url: string) => {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      setLinkOpen(false);
    },
    [editor],
  );

  const handleLinkRemove = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    setLinkOpen(false);
  }, [editor]);

  const handleImageSubmit = useCallback(
    (src: string) => {
      editor.chain().focus().setImage({ src }).run();
      setImageOpen(false);
    },
    [editor],
  );

  const handleInsertTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const currentLinkUrl = editor.getAttributes('link').href as string || '';

  return (
    <>
      <div className="rte-toolbar">
        {/* Undo / Redo */}
        <div className="rte-toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <UndoIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <RedoIcon />
          </ToolbarButton>
        </div>

        {/* Block type */}
        <div className="rte-toolbar-group">
          <ToolbarSelect
            value={getCurrentHeading()}
            onChange={handleHeadingChange}
            options={HEADING_OPTIONS}
            title="Block type"
          />
          <ToolbarSelect
            value={getCurrentFontSize()}
            onChange={handleFontSizeChange}
            options={FONT_SIZE_OPTIONS}
            title="Font size"
          />
        </div>

        {/* Inline formatting */}
        <div className="rte-toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <BoldIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <ItalicIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <StrikeIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Code"
          >
            <CodeIcon />
          </ToolbarButton>
        </div>

        {/* Colors */}
        <div className="rte-toolbar-group">
          <ColorPicker
            currentColor={editor.getAttributes('textStyle').color as string || null}
            onSelect={(color) => editor.chain().focus().setColor(color).run()}
            onClear={() => editor.chain().focus().unsetColor().run()}
            title="Text color"
          >
            <TextColorIcon />
          </ColorPicker>
          <ColorPicker
            currentColor={editor.getAttributes('highlight').color as string || null}
            onSelect={(color) => editor.chain().focus().toggleHighlight({ color }).run()}
            onClear={() => editor.chain().focus().unsetHighlight().run()}
            title="Highlight"
          >
            <HighlightIcon />
          </ColorPicker>
        </div>

        {/* Alignment */}
        <div className="rte-toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align left"
          >
            <AlignLeftIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align center"
          >
            <AlignCenterIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align right"
          >
            <AlignRightIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            active={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustifyIcon />
          </ToolbarButton>
        </div>

        {/* Lists & blocks */}
        <div className="rte-toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet list"
          >
            <BulletListIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Ordered list"
          >
            <OrderedListIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <BlockquoteIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            title="Code block"
          >
            <CodeBlockIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal rule"
          >
            <HorizontalRuleIcon />
          </ToolbarButton>
        </div>

        {/* Link, Image, Table */}
        <div className="rte-toolbar-group">
          <ToolbarButton
            onClick={() => setLinkOpen(true)}
            active={editor.isActive('link')}
            title="Link"
          >
            <LinkIcon />
          </ToolbarButton>
          {editor.isActive('link') && (
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove link"
            >
              <UnlinkIcon />
            </ToolbarButton>
          )}
          <ToolbarButton
            onClick={() => setImageOpen(true)}
            title="Insert image"
          >
            <ImageIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={handleInsertTable}
            title="Insert table"
          >
            <TableIcon />
          </ToolbarButton>
        </div>
      </div>

      <LinkDialog
        open={linkOpen}
        initialUrl={currentLinkUrl}
        onSubmit={handleLinkSubmit}
        onRemove={handleLinkRemove}
        onClose={() => setLinkOpen(false)}
      />
      <ImageDialog
        open={imageOpen}
        onSubmit={handleImageSubmit}
        onClose={() => setImageOpen(false)}
      />
    </>
  );
}
