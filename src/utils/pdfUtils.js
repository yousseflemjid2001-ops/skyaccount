import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (invoiceData, t) => {
    const doc = new jsPDF();
    const isRtl = false; // Simplify PDF to LTR for standard fonts compatibility initially

    // Company Header
    doc.setFontSize(22);
    doc.setTextColor(56, 189, 248); // Sky Blue
    doc.text("SkyAccount", 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("123 Business Street, Tech City", 20, 28);
    doc.text("Phone: +1 234 567 890", 20, 33);
    doc.text("Email: admin@skyaccount.com", 20, 38);

    // Invoice Info (Right side)
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(t.newInvoiceShort || "INVOICE", 150, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${t.invoiceId || "Invoice #"}: ${invoiceData.id}`, 150, 28);
    doc.text(`${t.date || "Date"}: ${invoiceData.date}`, 150, 33);
    doc.text(`${t.status || "Status"}: ${invoiceData.status}`, 150, 38);

    // Client Info
    doc.setDrawColor(200);
    doc.line(20, 45, 190, 45); // Divider

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(t.clientData || "Bill To:", 20, 55);

    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(invoiceData.client || "Client Name", 20, 62);
    // Add address if available

    // Table
    const tableColumn = [t.product || "Product", t.quantity || "Qty", t.price || "Price", t.amount || "Total"];
    const tableRows = invoiceData.items.map(item => [
        item.name,
        item.qty,
        item.price.toLocaleString(),
        item.total.toLocaleString()
    ]);

    doc.autoTable({
        startY: 70,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [56, 189, 248] }, // Sky Blue header
        styles: { fontSize: 10, cellPadding: 4 },
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.text(t.subtotal || "Subtotal", 140, finalY);
    doc.text((invoiceData.subtotal || "0").toLocaleString(), 170, finalY, { align: 'right' });

    doc.text(t.tax || "VAT (15%)", 140, finalY + 6);
    doc.text((invoiceData.tax || "0").toLocaleString(), 170, finalY + 6, { align: 'right' });

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(56, 189, 248);
    doc.text(t.totalFinal || "Grand Total", 140, finalY + 14);
    doc.text((invoiceData.total || "0").toLocaleString(), 170, finalY + 14, { align: 'right' });

    // Footer
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 105, 280, { align: 'center' });

    doc.save(`${invoiceData.id}.pdf`);
};

export const generateReportPDF = (reportTitle, headers, data, t) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(56, 189, 248);
    doc.text(reportTitle, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text("SkyAccount Financial System", 14, 33);

    // Table
    doc.autoTable({
        startY: 40,
        head: [headers],
        body: data,
        theme: 'grid',
        headStyles: { fillColor: [56, 189, 248] },
        styles: { fontSize: 10, cellPadding: 4 },
    });

    doc.save(`${reportTitle.replace(/\s+/g, '_')}.pdf`);
};
