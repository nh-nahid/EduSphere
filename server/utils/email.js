const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendEmail = async ({ to, subject, templateName, replacements }) => {
  try {
    const layoutPath = path.join(__dirname, '../emails/layouts/base.html');
    const templatePath = path.join(__dirname, `../emails/templates/${templateName}.html`);
    
    let html = fs.readFileSync(layoutPath, 'utf8');
    let template = fs.readFileSync(templatePath, 'utf8');

    if (replacements) {
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, value);
      }
    }
    
    html = html.replace('{{content}}', template);

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};