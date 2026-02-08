import { PAGE_GAP } from '../../constants';
import type { PageDimensions } from '../../types';

/**
 * Creates a DOM element for the page break widget decoration.
 * Renders a visual page separation: bottom page edge → gray gap with page
 * number → top page edge. The element spans the full paper width by using
 * negative margins to escape the content padding.
 */
export function createPageBreakElement(
  pageNumber: number,
  dims: PageDimensions,
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'rte-page-break';
  wrapper.contentEditable = 'false';
  wrapper.setAttribute('data-page-break', 'true');

  // Use inline margins so they always match the actual paper padding
  wrapper.style.marginLeft = `-${dims.margin.left}px`;
  wrapper.style.marginRight = `-${dims.margin.right}px`;

  // Bottom padding to simulate the bottom margin of the current page
  const bottomMargin = document.createElement('div');
  bottomMargin.className = 'rte-page-break__bottom-margin';
  bottomMargin.style.height = `${dims.margin.bottom}px`;
  wrapper.appendChild(bottomMargin);

  // Bottom edge of current page — shadow casts downward into the gap
  const bottomEdge = document.createElement('div');
  bottomEdge.className = 'rte-page-break__edge-bottom';
  wrapper.appendChild(bottomEdge);

  // Gap area between pages
  const gap = document.createElement('div');
  gap.className = 'rte-page-break__gap';
  gap.style.height = `${PAGE_GAP}px`;
  wrapper.appendChild(gap);

  // Page number centered in the gap
  const pageNum = document.createElement('div');
  pageNum.className = 'rte-page-break__page-number';
  pageNum.textContent = String(pageNumber);
  gap.appendChild(pageNum);

  // Top edge of next page — shadow casts upward into the gap
  const topEdge = document.createElement('div');
  topEdge.className = 'rte-page-break__edge-top';
  wrapper.appendChild(topEdge);

  // Top padding to simulate the top margin of the next page
  const topMargin = document.createElement('div');
  topMargin.className = 'rte-page-break__top-margin';
  topMargin.style.height = `${dims.margin.top}px`;
  wrapper.appendChild(topMargin);

  return wrapper;
}
