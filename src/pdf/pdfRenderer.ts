import type { PageDimensions } from '../types';

interface RenderedPage {
  element: HTMLElement;
}

/**
 * Creates an off-screen DOM container that clones the editor content,
 * removes page break decorations, and splits content into page-sized chunks
 * for PDF capture.
 */
export function renderPagesOffScreen(
  editorHtml: string,
  dims: PageDimensions,
): RenderedPage[] {
  const usableHeight = dims.height - dims.margin.top - dims.margin.bottom;
  const usableWidth = dims.width - dims.margin.left - dims.margin.right;

  // Create measurement container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = `${usableWidth}px`;
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.6';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.color = '#1a1a1a';
  container.innerHTML = editorHtml;

  // Remove any page break decorations from cloned content
  container.querySelectorAll('.rte-page-break').forEach((el) => el.remove());

  document.body.appendChild(container);

  const children = Array.from(container.children) as HTMLElement[];
  const pages: RenderedPage[] = [];
  let currentPageElements: HTMLElement[] = [];
  let currentHeight = 0;

  const flushPage = () => {
    if (currentPageElements.length === 0) return;

    const pageEl = document.createElement('div');
    pageEl.style.width = `${dims.width}px`;
    pageEl.style.height = `${dims.height}px`;
    pageEl.style.padding = `${dims.margin.top}px ${dims.margin.right}px ${dims.margin.bottom}px ${dims.margin.left}px`;
    pageEl.style.boxSizing = 'border-box';
    pageEl.style.background = '#fff';
    pageEl.style.fontSize = '14px';
    pageEl.style.lineHeight = '1.6';
    pageEl.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    pageEl.style.color = '#1a1a1a';
    pageEl.style.overflow = 'hidden';

    for (const el of currentPageElements) {
      pageEl.appendChild(el.cloneNode(true));
    }

    pages.push({ element: pageEl });
    currentPageElements = [];
    currentHeight = 0;
  };

  for (const child of children) {
    const style = window.getComputedStyle(child);
    const marginTop = parseFloat(style.marginTop) || 0;
    const marginBottom = parseFloat(style.marginBottom) || 0;
    const height = child.getBoundingClientRect().height + marginTop + marginBottom;

    if (currentHeight > 0 && currentHeight + height > usableHeight) {
      flushPage();
    }

    currentPageElements.push(child);
    currentHeight += height;
  }

  flushPage();

  document.body.removeChild(container);

  if (pages.length === 0) {
    // Return at least one blank page
    const blankPage = document.createElement('div');
    blankPage.style.width = `${dims.width}px`;
    blankPage.style.height = `${dims.height}px`;
    blankPage.style.background = '#fff';
    pages.push({ element: blankPage });
  }

  return pages;
}
