import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { Editor } from '@tiptap/core';

/**
 * ProseMirror NodeView for resizable images with drag handles.
 * Implemented as a vanilla DOM NodeView (not React) for performance.
 */
export class ImageResizeView {
  dom: HTMLElement;
  img: HTMLImageElement;
  private handles: HTMLElement[] = [];
  private dragging: { startX: number; startY: number; startWidth: number; startHeight: number } | null = null;

  constructor(
    private node: ProseMirrorNode,
    private editor: Editor,
    private getPos: () => number,
  ) {
    // Wrapper
    this.dom = document.createElement('div');
    this.dom.className = 'rte-image-resize';
    this.dom.style.display = 'inline-block';
    this.dom.style.position = 'relative';
    this.dom.style.lineHeight = '0';

    // Image
    this.img = document.createElement('img');
    this.img.src = node.attrs.src;
    if (node.attrs.alt) this.img.alt = node.attrs.alt;
    if (node.attrs.title) this.img.title = node.attrs.title;
    this.img.style.display = 'block';
    this.img.style.maxWidth = '100%';

    if (node.attrs.width) {
      this.img.style.width = node.attrs.width;
    }
    if (node.attrs.height) {
      this.img.style.height = node.attrs.height;
    }

    this.dom.appendChild(this.img);

    // Create resize handles (four corners)
    const positions = ['nw', 'ne', 'sw', 'se'] as const;
    for (const pos of positions) {
      const handle = document.createElement('div');
      handle.className = `rte-image-resize__handle rte-image-resize__handle--${pos}`;
      handle.addEventListener('mousedown', (e) => this.onMouseDown(e));
      this.dom.appendChild(handle);
      this.handles.push(handle);
    }

    // Show/hide handles on hover and selection
    this.dom.addEventListener('click', () => {
      this.editor.commands.setNodeSelection(this.getPos());
    });
  }

  private onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = this.img.getBoundingClientRect();
    this.dragging = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
    };

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return;

    const dx = e.clientX - this.dragging.startX;
    const aspectRatio = this.dragging.startWidth / this.dragging.startHeight;

    const newWidth = Math.max(50, this.dragging.startWidth + dx);
    const newHeight = newWidth / aspectRatio;

    this.img.style.width = `${Math.round(newWidth)}px`;
    this.img.style.height = `${Math.round(newHeight)}px`;
  };

  private onMouseUp = () => {
    if (!this.dragging) return;

    const width = `${Math.round(this.img.getBoundingClientRect().width)}px`;
    const height = `${Math.round(this.img.getBoundingClientRect().height)}px`;

    this.editor
      .chain()
      .focus()
      .command(({ tr }) => {
        const pos = this.getPos();
        tr.setNodeMarkup(pos, undefined, {
          ...this.node.attrs,
          width,
          height,
        });
        return true;
      })
      .run();

    this.dragging = null;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  update(node: ProseMirrorNode): boolean {
    if (node.type !== this.node.type) return false;
    this.node = node;

    this.img.src = node.attrs.src;
    if (node.attrs.alt) this.img.alt = node.attrs.alt;
    if (node.attrs.title) this.img.title = node.attrs.title;

    if (node.attrs.width) {
      this.img.style.width = node.attrs.width;
    }
    if (node.attrs.height) {
      this.img.style.height = node.attrs.height;
    }

    return true;
  }

  destroy() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  // Tell ProseMirror this is not an editable area
  stopEvent() {
    return false;
  }

  ignoreMutation() {
    return true;
  }
}
