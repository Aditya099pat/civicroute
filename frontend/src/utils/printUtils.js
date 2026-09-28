/**
 * Docket export utilities.
 * - printComplianceDocket: opens the browser print dialog (uses @media print CSS).
 * - downloadComplianceDocketPdf: renders the docket to a real, downloadable PDF.
 */

/** Triggers standard browser print with the docket layout. */
export function printComplianceDocket() {
  window.print();
}

/**
 * Render the hidden #print-docket element to a multi-page A4 PDF and download it.
 * Libraries are imported dynamically so they are only loaded when a user exports.
 */
export async function downloadComplianceDocketPdf(filename = 'civicroute-docket.pdf') {
  const el = document.getElementById('print-docket');
  if (!el) throw new Error('Docket element not found');

  const [{ default: html2canvas }, jspdfModule] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);
  const { jsPDF } = jspdfModule;

  // Temporarily reveal the docket off-screen so html2canvas can capture it.
  const prev = {
    display: el.style.display,
    position: el.style.position,
    left: el.style.left,
    top: el.style.top,
    width: el.style.width,
    zIndex: el.style.zIndex,
  };
  el.classList.remove('hidden');
  el.style.display = 'block';
  el.style.position = 'fixed';
  el.style.left = '-10000px';
  el.style.top = '0';
  el.style.width = '794px'; // ~A4 width at 96dpi
  el.style.zIndex = '-1';

  try {
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, pageW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pageW, imgH);
      heightLeft -= pageH;
    }
    pdf.save(filename);
  } finally {
    // Restore the element's hidden state.
    el.style.display = prev.display;
    el.style.position = prev.position;
    el.style.left = prev.left;
    el.style.top = prev.top;
    el.style.width = prev.width;
    el.style.zIndex = prev.zIndex;
    el.classList.add('hidden');
  }
}
