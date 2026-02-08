import type { Editor } from '@tiptap/core';
import type { PageDimensions } from '../types';
import { renderPagesOffScreen } from './pdfRenderer';

/**
 * Programmatic PDF export using html2canvas + jsPDF.
 * Clones editor content, renders each page off-screen, captures with html2canvas,
 * and assembles into a jsPDF document.
 */
export async function exportPdf(
  editor: Editor,
  dims: PageDimensions,
): Promise<Blob> {
  // Dynamic imports to keep these out of the main bundle for users who don't need PDF
  const [html2canvasModule, jsPDFModule] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);
  const html2canvas = html2canvasModule.default;
  const { jsPDF } = jsPDFModule;

  const html = editor.getHTML();
  const pages = renderPagesOffScreen(html, dims);

  // A4 in mm: 210 × 297
  const pageWidthMm = (dims.width / 96) * 25.4;
  const pageHeightMm = (dims.height / 96) * 25.4;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageWidthMm, pageHeightMm],
  });

  for (let i = 0; i < pages.length; i++) {
    const { element } = pages[i];
    document.body.appendChild(element);

    const canvas = await html2canvas(element, {
      width: dims.width,
      height: dims.height,
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    document.body.removeChild(element);

    const imgData = canvas.toDataURL('image/png');

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidthMm, pageHeightMm);
  }

  return pdf.output('blob');
}
