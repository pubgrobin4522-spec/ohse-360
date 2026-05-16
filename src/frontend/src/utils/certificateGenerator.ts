/**
 * Generates a printable certificate view from the provided HTMLElement
 * by opening a styled print window. Falls back gracefully if popup is blocked.
 *
 * @param element  - The DOM element containing the certificate (CertificateTemplate div)
 * @param filename - Used as the document title hint for the print dialog
 */
export async function generateCertificatePdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const html = element.outerHTML;
  // Collect all stylesheet hrefs and inline style content
  const styleLinks = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]'),
  )
    .map((l) => `<link rel="stylesheet" href="${(l as HTMLLinkElement).href}">`)
    .join("\n");
  const inlineStyles = Array.from(document.querySelectorAll("style"))
    .map((s) => `<style>${s.textContent}</style>`)
    .join("\n");

  const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${filename}</title>
  ${styleLinks}
  ${inlineStyles}
  <style>
    @page { size: A4 landscape; margin: 0; }
    body { margin: 0; padding: 0; background: #0f172a; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  </style>
</head>
<body>
  ${html}
  <script>window.onload = function() { window.focus(); window.print(); window.close(); };<\/script>
</body>
</html>`;

  const popup = window.open(
    "",
    "_blank",
    "width=1200,height=850,menubar=no,toolbar=no",
  );
  if (!popup) {
    // Popup blocked — fall back to in-page print
    const iframe = document.createElement("iframe");
    iframe.style.cssText =
      "position:fixed;left:-9999px;top:0;width:0;height:0;border:none;";
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printHtml);
      iframeDoc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow?.print();
        } catch {
          /* ignore */
        }
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 300);
    }
    return;
  }

  popup.document.open();
  popup.document.write(printHtml);
  popup.document.close();
}
