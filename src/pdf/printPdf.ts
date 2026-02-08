/**
 * Opens the browser's native print dialog.
 * Relies on CSS @page and @media print rules in print.css to produce
 * correctly paginated output.
 */
export function printPdf(): void {
  window.print();
}
