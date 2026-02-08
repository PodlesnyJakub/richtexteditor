import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { EditorView } from '@tiptap/pm/view';
import type { PageDimensions } from '../../types';
import { PAGINATION_DEBOUNCE_MS, PAGE_GAP } from '../../constants';
import { getNodeHeight } from './heightCalculator';
import { createPageBreakElement } from './pageBreakDecoration';
import { debounce } from '../../utils/debounce';

export const paginationPluginKey = new PluginKey('pagination');

interface PaginationState {
  decorations: DecorationSet;
  pageCount: number;
}

/**
 * Calculates page breaks by iterating top-level nodes, measuring their heights,
 * and inserting widget decorations when content overflows a page.
 */
function calculatePageBreaks(
  view: EditorView,
  dims: PageDimensions,
): { decorations: Decoration[]; pageCount: number } {
  const decorations: Decoration[] = [];
  const usableHeight = dims.height - dims.margin.top - dims.margin.bottom;
  let currentPageHeight = 0;
  let pageNumber = 1;

  const { doc } = view.state;

  doc.forEach((node, offset) => {
    const nodeHeight = getNodeHeight(view, offset);

    // If adding this node would overflow the current page
    if (currentPageHeight > 0 && currentPageHeight + nodeHeight > usableHeight) {
      // Insert page break decoration before this node
      const widget = Decoration.widget(
        offset,
        () => createPageBreakElement(pageNumber, dims),
        {
          side: -1,
          key: `page-break-${pageNumber}`,
        },
      );
      decorations.push(widget);
      pageNumber++;
      currentPageHeight = nodeHeight;
    } else {
      currentPageHeight += nodeHeight;
    }
  });

  return { decorations, pageCount: pageNumber };
}

/**
 * Walk up from the editor DOM to find the .rte-paper container
 * and set its min-height to fit all pages.
 */
function updatePaperHeight(
  view: EditorView,
  pageCount: number,
  dims: PageDimensions,
): void {
  let el: HTMLElement | null = view.dom;
  while (el) {
    if (el.classList.contains('rte-paper')) {
      // Each page break adds: bottom margin + edge + gap + edge + top margin
      const breakHeight =
        dims.margin.bottom + PAGE_GAP + dims.margin.top;
      const totalHeight =
        pageCount * dims.height + (pageCount - 1) * breakHeight;
      el.style.minHeight = `${totalHeight}px`;
      return;
    }
    el = el.parentElement;
  }
}

export function createPaginationPlugin(dims: PageDimensions): Plugin<PaginationState> {
  return new Plugin<PaginationState>({
    key: paginationPluginKey,

    state: {
      init() {
        return {
          decorations: DecorationSet.empty,
          pageCount: 1,
        };
      },

      apply(tr, value) {
        if (tr.getMeta(paginationPluginKey)) {
          return tr.getMeta(paginationPluginKey) as PaginationState;
        }
        // Map decorations through document changes
        if (tr.docChanged) {
          return {
            decorations: value.decorations.map(tr.mapping, tr.doc),
            pageCount: value.pageCount,
          };
        }
        return value;
      },
    },

    props: {
      decorations(state) {
        return paginationPluginKey.getState(state)?.decorations ?? DecorationSet.empty;
      },
    },

    view(editorView) {
      const recalculate = () => {
        if (!editorView.dom.isConnected) return;

        const { decorations, pageCount } = calculatePageBreaks(editorView, dims);
        const decorationSet = DecorationSet.create(
          editorView.state.doc,
          decorations,
        );

        // Directly size the paper to fit all pages
        updatePaperHeight(editorView, pageCount, dims);

        const tr = editorView.state.tr;
        tr.setMeta(paginationPluginKey, {
          decorations: decorationSet,
          pageCount,
        });
        tr.setMeta('addToHistory', false);
        editorView.dispatch(tr);
      };

      const debouncedRecalc = debounce(recalculate, PAGINATION_DEBOUNCE_MS);

      // ResizeObserver for catching image loads, resizes, etc.
      const resizeObserver = new ResizeObserver(() => {
        debouncedRecalc();
      });
      resizeObserver.observe(editorView.dom);

      // Initial calculation after mount
      setTimeout(recalculate, 50);

      return {
        update() {
          debouncedRecalc();
        },
        destroy() {
          debouncedRecalc.cancel();
          resizeObserver.disconnect();
        },
      };
    },
  });
}
