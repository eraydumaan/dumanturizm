import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, message } = req.body;

  // Validasyon
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Tüm alanları doldurun' });
  }

  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  // Mail içeriği
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `Yeni İletişim Formu - ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c3753b; border-bottom: 2px solid #c3753b; padding-bottom: 10px;">
          Yeni İletişim Formu
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Ad Soyad:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <a href="tel:${phone}" style="color: #c3753b;">${phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; vertical-align: top;">Servis İhtiyacı:</td>
            <td style="padding: 10px;">${message.replace(/\n/g, '<br>')}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #f5f0e8; border-radius: 8px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            Bu mesaj dumanturizm.com iletişim formundan gönderilmiştir.
          </p>
        </div>
      </div>
    `,
    replyTo: phone, // Telefon numarası (email olmadığı için)
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Mesajınız başarıyla gönderildi!' });
  } catch (error) {
    console.error('Mail gönderme hatası:', error);
    return res.status(500).json({ error: 'Mail gönderilemedi. Lütfen tekrar deneyin.' });
  }
}
