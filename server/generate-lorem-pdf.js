const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateLoremAssignment() {
  const dirPath = path.join(__dirname, 'public/documents');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, 'assignment-lorem.pdf');
  const doc = new PDFDocument({ margin: 50 });
  const writeStream = fs.createWriteStream(filePath);

  doc.pipe(writeStream);

  // ── Header Block ──
  doc.fontSize(22).font('Helvetica-Bold').fillColor('#0d9488').text('ACADEMIC ASSIGNMENT SHEET', { align: 'center' });
  doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('Subject Course: General Sciences & Calculus', { align: 'center' });
  doc.text('Academic Term: Autumn 2026-2027', { align: 'center' });
  doc.moveDown();

  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cbd5e1').stroke();
  doc.moveDown();

  // ── Title ──
  doc.fontSize(15).font('Helvetica-Bold').fillColor('#0f172a').text('Coursework Unit 3: Linear Systems & Heat Equations');
  doc.fontSize(10).font('Helvetica-Oblique').fillColor('#64748b').text('Due Date: Friday, September 15, 2026');
  doc.moveDown();

  // ── General Guidelines ──
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('General Submission Guidelines:');
  doc.fontSize(10).font('Helvetica').fillColor('#334155').text(
    '1. All answers must be shown with complete step-by-step calculus workings.\n' +
    '2. Submissions should be exported to PDF and uploaded online through the fee/student portal.\n' +
    '3. Plagiarism is strictly prohibited and will result in an immediate fail grade.'
  );
  doc.moveDown();

  // ── Questions Section ──
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('Coursework Tasks (Lorem Ipsum):');
  doc.moveDown(0.5);

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#0f172a').text('Question 1: Linear Matrix Solutions (15 Marks)');
  doc.font('Helvetica').fillColor('#334155').text(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet felis convallis, ' +
    'vulputate magna vitae, rhoncus ex. Proin sollicitudin justo lorem, vel accumsan elit ' +
    'vestibulum in. Ut quis accumsan metus. Nunc scelerisque eros eget imperdiet consequat.'
  );
  doc.moveDown();

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#0f172a').text('Question 2: Heat Dispersion Equations (25 Marks)');
  doc.font('Helvetica').fillColor('#334155').text(
    'Sed sed ex sed sapien placerat scelerisque. Curabitur sed ligula lorem. Integer tristique ' +
    'feugiat ipsum, vitae finibus lacus interdum vitae. Aliquam id convallis risus, in bibendum ' +
    'lectus. Cras non nisl vel velit egestas pulvinar et eget lectus.'
  );
  doc.moveDown();

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#0f172a').text('Question 3: Graphical Models & Graph Plotting (10 Marks)');
  doc.font('Helvetica').fillColor('#334155').text(
    'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; ' +
    'Donec quis mi nec erat accumsan condimentum in non massa. Curabitur convallis leo at ' +
    'urna ultrices gravida.'
  );
  doc.moveDown(2);

  // ── Footer ──
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e2e8f0').stroke();
  doc.moveDown(0.5);
  doc.fontSize(9).font('Helvetica').fillColor('#94a3b8').text(
    'Issued by department Board of Examiners. © SchoolMS Network Systems.',
    { align: 'center' }
  );

  doc.end();

  writeStream.on('finish', () => {
    console.log('✅ Generated assignment-lorem.pdf successfully');
    process.exit(0);
  });
}

generateLoremAssignment();
