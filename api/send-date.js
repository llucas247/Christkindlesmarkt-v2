// api/send-date.js
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, date, time, context } = req.body || {};

  if (!date || !time) {
    return res.status(400).json({ error: "Missing date or time" });
  }

  const displayName = name && name.trim() ? name.trim() : "Lena";

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,      // z.B. smtp.web.de
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,    // z.B. lucaslein@web.de
        pass: process.env.SMTP_PASS     // dein SMTP/App-Passwort
      }
    });

    await transporter.sendMail({
      from: `"Date-Seite Christkindlesmarkt" <${process.env.SMTP_USER}>`,
      to: "lucaslein@web.de",
      subject: "Neues Date auf dem Nürnberger Christkindlesmarkt 🎄",
      text: `
${context || "Date-Anfrage"}:

Name: ${displayName}
Gewählter Termin: ${date} um ${time} Uhr
      `,
      html: `
        <h2>Neues Date auf dem Nürnberger Christkindlesmarkt 🎄</h2>
        <p><strong>Name:</strong> ${displayName}</p>
        <p><strong>Gewählter Termin:</strong> ${date} um ${time} Uhr</p>
        <p>Viel Spaß auf dem Christkindlesmarkt!</p>
      `
    });

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Mail error:", err);
    return res.status(500).json({ error: "Mail failed" });
  }
};
