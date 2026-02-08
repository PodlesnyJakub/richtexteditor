import type { PageDimensions, PageFormat } from './types';

// 1 inch = 96 CSS pixels (standard)
const INCH = 96;

export const PAGE_FORMATS: Record<PageFormat, PageDimensions> = {
  a4: {
    // A4: 210mm × 297mm ≈ 8.27in × 11.69in
    width: Math.round(8.27 * INCH),   // 794px
    height: Math.round(11.69 * INCH), // 1123px
    margin: {
      top: INCH,
      bottom: INCH,
      left: INCH,
      right: INCH,
    },
  },
  letter: {
    // US Letter: 8.5in × 11in
    width: Math.round(8.5 * INCH),  // 816px
    height: Math.round(11 * INCH),  // 1056px
    margin: {
      top: INCH,
      bottom: INCH,
      left: INCH,
      right: INCH,
    },
  },
};

/** Gap between pages in the editor view (px) */
export const PAGE_GAP = 40;

/** Debounce delay for pagination recalculation (ms) */
export const PAGINATION_DEBOUNCE_MS = 100;
