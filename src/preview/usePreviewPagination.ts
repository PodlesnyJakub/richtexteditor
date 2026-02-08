import { useState, useEffect, useRef } from 'react';
import { PAGE_FORMATS } from '../constants';
import type { PageFormat, PageDimensions } from '../types';

interface PageContent {
  html: string;
}

/**
 * Takes HTML content and splits it into page-sized chunks by measuring
 * block element heights in an off-screen container.
 */
export function usePreviewPagination(
  content: string,
  pageFormat: PageFormat = 'a4',
): PageContent[] {
  const [pages, setPages] = useState<PageContent[]>([{ html: content }]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dims = PAGE_FORMATS[pageFormat];
    const usableHeight = dims.height - dims.margin.top - dims.margin.bottom;
    const usableWidth = dims.width - dims.margin.left - dims.margin.right;

    // Create off-screen measurement container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${usableWidth}px`;
    container.style.fontSize = '14px';
    container.style.lineHeight = '1.6';
    container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    container.innerHTML = content;
    document.body.appendChild(container);
    containerRef.current = container;

    const children = Array.from(container.children) as HTMLElement[];
    const resultPages: PageContent[] = [];
    let currentPageHtml = '';
    let currentHeight = 0;

    for (const child of children) {
      const style = window.getComputedStyle(child);
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;
      const height = child.getBoundingClientRect().height + marginTop + marginBottom;

      if (currentHeight > 0 && currentHeight + height > usableHeight) {
        resultPages.push({ html: currentPageHtml });
        currentPageHtml = child.outerHTML;
        currentHeight = height;
      } else {
        currentPageHtml += child.outerHTML;
        currentHeight += height;
      }
    }

    if (currentPageHtml) {
      resultPages.push({ html: currentPageHtml });
    }

    if (resultPages.length === 0) {
      resultPages.push({ html: content });
    }

    setPages(resultPages);

    document.body.removeChild(container);
    containerRef.current = null;
  }, [content, pageFormat]);

  return pages;
}
