export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.md') ? filename : `${filename}.md`
  link.click()
  URL.revokeObjectURL(url)
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function exportPdf(content: string, title: string) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
  if (!printWindow) {
    throw new Error('Popup blocked. Allow popups to export PDF.')
  }

  const safeTitle = escapeHtml(title)
  const body = escapeHtml(content).replaceAll('\n', '<br />')

  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${safeTitle}</title>
    <style>
      body {
        font-family: Georgia, 'Times New Roman', serif;
        color: #111;
        line-height: 1.7;
        max-width: 760px;
        margin: 40px auto;
        padding: 0 24px;
      }
      h1 {
        font-family: Inter, Arial, sans-serif;
        font-size: 22px;
        margin-bottom: 8px;
      }
      .meta {
        color: #666;
        font-size: 12px;
        margin-bottom: 28px;
        font-family: Inter, Arial, sans-serif;
      }
      .content {
        white-space: pre-wrap;
        font-size: 14px;
      }
      @media print {
        body { margin: 0; }
      }
    </style>
  </head>
  <body>
    <h1>${safeTitle}</h1>
    <div class="meta">Exported from ContentAI · ${new Date().toLocaleString()}</div>
    <div class="content">${body}</div>
    <script>
      window.onload = () => {
        window.focus();
        window.print();
      };
    </script>
  </body>
</html>`)
  printWindow.document.close()
}
