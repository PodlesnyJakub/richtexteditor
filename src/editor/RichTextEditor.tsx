import React, { forwardRef, useImperativeHandle, useCallback, useRef } from 'react';
import { EditorContent } from '@tiptap/react';
import { useEditorSetup } from './useEditorSetup';
import { Toolbar } from '../toolbar/Toolbar';
import { exportPdf } from '../pdf/exportPdf';
import { printPdf } from '../pdf/printPdf';
import { PAGE_FORMATS } from '../constants';
import { classNames } from '../utils/classNames';
import type { RichTextEditorProps, RichTextEditorRef } from '../types';

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  function RichTextEditor(props, ref) {
    const {
      initialContent,
      onChange,
      placeholder,
      pageFormat = 'a4',
      pagination = true,
      className,
    } = props;

    const editorContainerRef = useRef<HTMLDivElement>(null);
    const pageCountRef = useRef(1);

    const editor = useEditorSetup({
      initialContent,
      onChange,
      placeholder,
      pagination,
      pageFormat,
    });

    const getPageCount = useCallback(() => {
      if (!editorContainerRef.current) return 1;
      const breaks = editorContainerRef.current.querySelectorAll(
        '.rte-page-break',
      );
      return breaks.length + 1;
    }, []);

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() ?? '',
      getJSON: () => editor?.getJSON() ?? { type: 'doc', content: [] },
      exportPdf: async () => {
        if (!editor) throw new Error('Editor not initialized');
        return exportPdf(editor, PAGE_FORMATS[pageFormat]);
      },
      print: () => {
        printPdf();
      },
      getPageCount,
      getEditor: () => editor,
    }), [editor, pageFormat, getPageCount]);

    // Track page count from pagination plugin meta
    React.useEffect(() => {
      if (!editor) return;
      const handler = () => {
        pageCountRef.current = getPageCount();
      };
      editor.on('update', handler);
      return () => {
        editor.off('update', handler);
      };
    }, [editor, getPageCount]);

    const dims = PAGE_FORMATS[pageFormat];

    if (!editor) return null;

    return (
      <div className={classNames('rte-wrapper', className)}>
        <Toolbar editor={editor} />
        <div className="rte-editor-area">
          <div
            ref={editorContainerRef}
            className="rte-paper"
            style={{
              width: dims.width,
              paddingTop: dims.margin.top,
              paddingBottom: dims.margin.bottom,
              paddingLeft: dims.margin.left,
              paddingRight: dims.margin.right,
            }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    );
  },
);
