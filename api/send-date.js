// api/send-date.js – TESTVERSION OHNE MAIL

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, date, time, context } = req.body || {};

  if (!date || !time) {
    return res.status(400).json({ error: "Missing date or time" });
  }

  console.log("Neue Date-Anfrage:", { name, date, time, context });

  // WICHTIG: Wir tun so, als hätte alles geklappt
  return res.status(200).json({ status: "ok" });
};
