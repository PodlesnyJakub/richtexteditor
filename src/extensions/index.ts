import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import type { Extensions } from '@tiptap/core';

import { FontSize } from './FontSize';
import { DocumentProtection } from './DocumentProtection/DocumentProtectionPlugin';
import { PaginationExtension } from './pagination/PaginationExtension';
import { ImageResizeExtension } from './ImageResize/ImageResizeExtension';
import { DragHandle } from './DragHandle/DragHandlePlugin';
import type { PageFormat } from '../types';

export interface ExtensionOptions {
  placeholder?: string;
  pagination?: boolean;
  pageFormat?: PageFormat;
}

export function createExtensions(options: ExtensionOptions): Extensions {
  const {
    placeholder = 'Start typing...',
    pagination = true,
    pageFormat = 'a4',
  } = options;

  const extensions: Extensions = [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    Underline,
    Strike,
    Code,
    CodeBlock,
    Heading.configure({ levels: [1, 2, 3, 4] }),
    BulletList,
    OrderedList,
    ListItem,
    Blockquote,
    HorizontalRule,
    HardBreak,
    History,
    Dropcursor,
    Gapcursor,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    FontSize,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
    }),
    ImageResizeExtension,
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
    Placeholder.configure({ placeholder }),
    DocumentProtection,
    DragHandle,
  ];

  if (pagination) {
    extensions.push(
      PaginationExtension.configure({ pageFormat }),
    );
  }

  return extensions;
}
