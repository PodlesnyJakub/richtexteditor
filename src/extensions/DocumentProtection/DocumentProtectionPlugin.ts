import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

const pluginKey = new PluginKey('documentProtection');

/**
 * Prevents transactions that would delete the document node or leave
 * it completely empty (no block children).
 */
export const DocumentProtection = Extension.create({
  name: 'documentProtection',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: pluginKey,
        filterTransaction(tr) {
          // Allow meta-only transactions (selection, pagination, etc.)
          if (!tr.docChanged) return true;

          const { doc } = tr;
          // Ensure the document always has at least one child block
          if (doc.childCount === 0) return false;

          return true;
        },
      }),
    ];
  },
});
