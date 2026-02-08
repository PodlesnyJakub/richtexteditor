import type { EditorView } from '@tiptap/pm/view';

/**
 * Measures the height of a top-level document node by getting its DOM element.
 * Returns the full height including margins.
 */
export function getNodeHeight(view: EditorView, pos: number): number {
  const dom = view.nodeDOM(pos);
  if (!dom || !(dom instanceof HTMLElement)) return 0;

  const rect = dom.getBoundingClientRect();
  const style = window.getComputedStyle(dom);
  const marginTop = parseFloat(style.marginTop) || 0;
  const marginBottom = parseFloat(style.marginBottom) || 0;

  return rect.height + marginTop + marginBottom;
}

/**
 * Get the top offset of a node relative to the editor container.
 */
export function getNodeOffsetTop(view: EditorView, pos: number): number {
  const dom = view.nodeDOM(pos);
  if (!dom || !(dom instanceof HTMLElement)) return 0;

  const editorRect = view.dom.getBoundingClientRect();
  const nodeRect = dom.getBoundingClientRect();
  const style = window.getComputedStyle(dom);
  const marginTop = parseFloat(style.marginTop) || 0;

  return nodeRect.top - editorRect.top - marginTop;
}
