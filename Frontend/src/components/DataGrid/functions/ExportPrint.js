export function PrintData(items, columns, category, translate) {
    const printWindow = window.open('', '_blank');
  
    if (printWindow) {
      const htmlContent = `
        <html>
          <head>
            <title>${category} Print</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .print-header { margin-bottom: 20px; }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>${category} selected data</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
              <p>Items: ${items.length}</p>
              <button class="no-print" onclick="window.print()">Print</button>
              <button class="no-print" onclick="window.close()">Close</button>
            </div>
            <table>
              <thead>
                <tr>
                  ${columns.map(col => `<th>${translate(col.i18n)}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${items.map(row => `
                  <tr>
                    ${columns.map(col => {
                      if (col.key === 'obrazek' || col.key === 'vektor') {
                        return row[col.key] ? 
                          `<td><img src="${row[col.key]}" style="max-width: 60px; height: auto;" alt="${col.key}"></td>` : 
                          `<td>—</td>`;
                      }
                      return `<td>${row[col.key] ?? '—'}</td>`;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
  
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    }
  }
  