const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateFeeInvoice = async ({ payment, student, fee, school, studentName }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `${payment._id}.pdf`;
      const filePath = path.join(__dirname, '../public/invoices', fileName);
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      
      doc.fontSize(22).font('Helvetica-Bold').text(school.name || 'School Name', { align: 'center' });
      doc.fontSize(10).font('Helvetica').text(school.address || '', { align: 'center' });
      doc.fontSize(10).text(school.email || '', { align: 'center' });
      doc.moveDown();

      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(16).font('Helvetica-Bold').text('FEE RECEIPT', { align: 'center' });
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown();

      
      const col1 = 50, col2 = 300;
      const rowH = 20;
      let y = doc.y;

      doc.fontSize(11).font('Helvetica-Bold').text('Receipt No:', col1, y).font('Helvetica').text(String(payment.gatewayTxnId || payment._id), col2, y);
      y += rowH;
      doc.font('Helvetica-Bold').text('Date:', col1, y).font('Helvetica').text(payment.paidAt ? new Date(payment.paidAt).toDateString() : new Date().toDateString(), col2, y);
      y += rowH;
      doc.font('Helvetica-Bold').text('Student Name:', col1, y).font('Helvetica').text(studentName || student.guardianName || 'N/A', col2, y);
      y += rowH;
      doc.font('Helvetica-Bold').text('Roll No:', col1, y).font('Helvetica').text(student.roll || 'N/A', col2, y);
      y += rowH;
      doc.font('Helvetica-Bold').text('Guardian:', col1, y).font('Helvetica').text(student.guardianName || 'N/A', col2, y);
      y += rowH + 10;

      doc.moveTo(50, y).lineTo(545, y).stroke();
      y += 10;

      
      doc.fontSize(12).font('Helvetica-Bold').text('Fee Details', col1, y);
      y += rowH;
      doc.fontSize(11).font('Helvetica-Bold').text('Description:', col1, y).font('Helvetica').text(`${fee.title} (${fee.type})`, col2, y);
      y += rowH;
      doc.font('Helvetica-Bold').text('Academic Year:', col1, y).font('Helvetica').text(fee.academicYear || 'N/A', col2, y);
      y += rowH;
      doc.font('Helvetica-Bold').text('Due Date:', col1, y).font('Helvetica').text(fee.dueDate ? new Date(fee.dueDate).toDateString() : 'N/A', col2, y);
      y += rowH;
      doc.font('Helvetica-Bold').text('Status:', col1, y).font('Helvetica').text('PAID', col2, y);
      y += rowH + 10;

      doc.moveTo(50, y).lineTo(545, y).stroke();
      y += 10;

      
      doc.fontSize(14).font('Helvetica-Bold').text('Amount Paid:', col1, y).text(`৳ ${payment.amount.toFixed(2)}`, col2, y);
      y += 30;

      
      doc.moveTo(50, y).lineTo(545, y).stroke();
      y += 15;
      doc.fontSize(10).font('Helvetica').fillColor('gray')
        .text('This is a computer-generated receipt and does not require a signature.', 50, y, { align: 'center' });

      doc.end();

      writeStream.on('finish', () => resolve(`/invoices/${fileName}`));
      writeStream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};