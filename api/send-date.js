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
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Date-Seite Christkindlesmarkt" <${process.env.SMTP_USER}>`,
      to: "lucaslein@web.de",
      subject: "Neues Date auf dem Nürnberger Christkindlesmarkt 🎄",
      html: `
        <h2>Neue Date-Auswahl</h2>
        <p><strong>Name:</strong> ${displayName}</p>
        <p><strong>Datum:</strong> ${date}</p>
        <p><strong>Uhrzeit:</strong> ${time}</p>
        <p>Kontext: ${context || "Nürnberger Christkindlesmarkt Date"}</p>
      `
    });

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Mail error:", error);
    return res.status(500).json({ error: "Mail failed" });
  }
};
