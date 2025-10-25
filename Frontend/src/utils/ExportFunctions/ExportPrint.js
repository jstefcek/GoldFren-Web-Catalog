import { CapFirstLetter } from '../utils';

export function PrintData(items, columns, category, translate) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const generatedAt = new Date().toLocaleString();

  const htmlContent = `
    <html>
      <head>
        <title>${category} – Exported Data</title>
        <style>
          /* ====== Base Styles ====== */
          body {
            font-family: "Segoe UI", Roboto, Arial, sans-serif;
            margin: 30px;
            color: #333;
          }
          h1 {
            margin-bottom: 5px;
            font-size: 24px;
            color: #222;
          }
          p {
            margin: 3px 0;
            font-size: 13px;
            color: #555;
          }

          /* ====== Header with Logo (Left-Aligned) ====== */
          .header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 20px;
            margin-bottom: 25px;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .logo {
            height: 55px;
            width: auto;
            max-width: 220px;
            object-fit: contain;
          }
          .header-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          /* ====== Buttons (Hidden in Print) ====== */
          .controls {
            position: fixed;
            top: 15px;
            right: 15px;
            display: flex;
            gap: 8px;
          }
          button {
            padding: 6px 12px;
            background: #0078d7;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          }
          button:hover {
            background: #005ea0;
          }
          @media print {
            .no-print, .controls {
              display: none !important;
            }
          }

          /* ====== Table Styles ====== */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 13px;
            word-break: break-word;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 6px 8px;
            text-align: left;
            vertical-align: top;
          }
          th {
            background-color: #f3f3f3;
            font-weight: 600;
          }
          tr:nth-child(even) td {
            background-color: #fafafa;
          }
          img {
            max-width: 80px;
            height: auto;
            display: block;
            margin: 0 auto;
          }

          /* ====== Page Breaks ====== */
          @media print {
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="controls no-print">
          <button onclick="window.print()">🖨️ Print</button>
          <button onclick="window.close()">✖️ Close</button>
        </div>

        <div class="header">
          <div class="header-left">
            <img src="/logo/goldfren-logo.svg" alt="GoldFren Logo" class="logo" onerror="this.style.display='none'">
            <div class="header-info">
              <h1>${CapFirstLetter(category)} – Exported Data</h1>
              <p><strong>Generated:</strong> ${generatedAt}</p>
              <p><strong>Total Items:</strong> ${items.length}</p>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              ${columns.map(col => `<th>${translate(col.label) || col.label || '—'}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${items.map(row => `
              <tr>
                ${columns.map(col => {
                  const value = row[col.key];
                  if (col.key === 'obrazek' || col.key === 'vektor' || col.type === 'image' || col.type === 'vector') {
                    return value
                      ? `<td><img src="${value}" alt="${col.key}"></td>`
                      : `<td>—</td>`;
                  }
                  return `<td>${value !== undefined && value !== null && value !== '' ? value : '—'}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>

        <footer style="margin-top:40px; font-size:12px; color:#777;">
          <hr>
          <p>© ${new Date().getFullYear()} GOLD FREN s.r.o. | Generated ${generatedAt}</p>
        </footer>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 700);
}