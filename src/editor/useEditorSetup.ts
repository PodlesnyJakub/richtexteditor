import { useEditor } from '@tiptap/react';
import type { JSONContent } from '@tiptap/core';
import { createExtensions } from '../extensions';
import type { PageFormat } from '../types';

interface UseEditorSetupOptions {
  initialContent?: string;
  onChange?: (html: string, json: JSONContent) => void;
  placeholder?: string;
  pagination?: boolean;
  pageFormat?: PageFormat;
}

export function useEditorSetup(options: UseEditorSetupOptions) {
  const {
    initialContent = '<p></p>',
    onChange,
    placeholder,
    pagination = true,
    pageFormat = 'a4',
  } = options;

  const editor = useEditor({
    extensions: createExtensions({ placeholder, pagination, pageFormat }),
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML(), editor.getJSON());
    },
  });

  return editor;
}
