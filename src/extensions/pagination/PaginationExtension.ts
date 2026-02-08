import { Extension } from '@tiptap/core';
import { createPaginationPlugin } from './PaginationPlugin';
import { PAGE_FORMATS } from '../../constants';
import type { PageFormat } from '../../types';

export interface PaginationOptions {
  pageFormat: PageFormat;
}

export const PaginationExtension = Extension.create<PaginationOptions>({
  name: 'pagination',

  addOptions() {
    return {
      pageFormat: 'a4' as PageFormat,
    };
  },

  addProseMirrorPlugins() {
    const dims = PAGE_FORMATS[this.options.pageFormat];
    return [createPaginationPlugin(dims)];
  },
});
