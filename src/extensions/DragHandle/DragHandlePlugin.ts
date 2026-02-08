import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, NodeSelection } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

const pluginKey = new PluginKey('dragHandle');

function createDragHandleElement(): HTMLDivElement {
  const handle = document.createElement('div');
  handle.className = 'rte-drag-handle';
  handle.draggable = true;
  handle.setAttribute('data-drag-handle', 'true');
  handle.contentEditable = 'false';
  // Grip icon (6 dots)
  handle.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">' +
    '<circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/>' +
    '<circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/>' +
    '<circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/>' +
    '</svg>';
  return handle;
}

interface BlockHit {
  pos: number;
  dom: HTMLElement;
}

function resolveTopLevelBlock(
  view: EditorView,
  y: number,
): BlockHit | null {
  const { doc } = view.state;

  let closestPos = -1;
  let closestDom: HTMLElement | null = null;
  let closestDist = Infinity;

  doc.forEach((_node, offset) => {
    const dom = view.nodeDOM(offset);
    if (!dom || !(dom instanceof HTMLElement)) return;

    const rect = dom.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const dist = Math.abs(y - centerY);

    if (y >= rect.top - 4 && y <= rect.bottom + 4) {
      if (dist < closestDist) {
        closestPos = offset;
        closestDom = dom;
        closestDist = dist;
      }
    }
  });

  if (closestPos < 0 || !closestDom) return null;
  return { pos: closestPos, dom: closestDom };
}

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    let handle: HTMLDivElement | null = null;
    let currentBlockPos: number | null = null;
    let paper: HTMLElement | null = null;
    let bound = false;

    return [
      new Plugin({
        key: pluginKey,

        view(editorView) {
          handle = createDragHandleElement();
          handle.style.display = 'none';

          /**
           * Lazily find .rte-paper — at plugin creation time, React hasn't
           * mounted the editor into the DOM tree yet, so we defer.
           */
          const ensureMounted = (): boolean => {
            if (paper) return true;
            let el: HTMLElement | null = editorView.dom;
            while (el) {
              if (el.classList.contains('rte-paper')) {
                paper = el;
                paper.appendChild(handle!);
                return true;
              }
              el = el.parentElement;
            }
            return false;
          };

          const onMouseMove = (e: MouseEvent) => {
            if (!handle) return;
            if (!ensureMounted()) return;

            const result = resolveTopLevelBlock(editorView, e.clientY);
            if (!result) {
              handle.style.display = 'none';
              currentBlockPos = null;
              return;
            }

            currentBlockPos = result.pos;
            const paperRect = paper!.getBoundingClientRect();
            const blockRect = result.dom.getBoundingClientRect();

            handle.style.display = 'flex';
            handle.style.top = `${blockRect.top - paperRect.top + blockRect.height / 2 - 12}px`;
            handle.style.left = '8px';
          };

          const onMouseLeave = (e: MouseEvent) => {
            if (!handle) return;
            const related = e.relatedTarget as Node | null;
            if (related && paper?.contains(related)) return;
            handle.style.display = 'none';
            currentBlockPos = null;
          };

          const onDragStart = (e: DragEvent) => {
            if (currentBlockPos === null) return;

            const { state } = editorView;
            const node = state.doc.nodeAt(currentBlockPos);
            if (!node) return;

            const sel = NodeSelection.create(state.doc, currentBlockPos);
            editorView.dispatch(state.tr.setSelection(sel));

            const slice = sel.content();
            editorView.dragging = { slice, move: true };

            e.dataTransfer?.setData('text/plain', node.textContent || '');
            e.dataTransfer!.effectAllowed = 'move';

            const blockDom = editorView.nodeDOM(currentBlockPos);
            if (blockDom instanceof HTMLElement && e.dataTransfer) {
              e.dataTransfer.setDragImage(blockDom, 0, 0);
            }
          };

          const onDrop = () => {
            if (handle) {
              handle.style.display = 'none';
              currentBlockPos = null;
            }
          };

          handle.addEventListener('dragstart', onDragStart);
          editorView.dom.addEventListener('drop', onDrop);

          /**
           * Bind paper-level events once the paper is available.
           * We use a RAF loop that retries until React has mounted .rte-paper.
           */
          const bindPaperEvents = () => {
            if (bound) return;
            if (!ensureMounted()) {
              requestAnimationFrame(bindPaperEvents);
              return;
            }
            paper!.addEventListener('mousemove', onMouseMove);
            paper!.addEventListener('mouseleave', onMouseLeave);
            bound = true;
          };
          requestAnimationFrame(bindPaperEvents);

          return {
            update() {},
            destroy() {
              if (paper) {
                paper.removeEventListener('mousemove', onMouseMove);
                paper.removeEventListener('mouseleave', onMouseLeave);
              }
              editorView.dom.removeEventListener('drop', onDrop);
              if (handle) {
                handle.removeEventListener('dragstart', onDragStart);
                handle.remove();
                handle = null;
              }
              paper = null;
              bound = false;
            },
          };
        },
      }),
    ];
  },
});
