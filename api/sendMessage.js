import fetch from "node-fetch";
import crypto from "crypto";

export default async function handler(req, res) {
  const username = req.query.username || req.body?.username;
  const message = req.query.message || req.body?.message;
  const total = parseInt(req.query.total || req.body?.total || "5");

  if (!username || !message || !total) {
    return res.status(400).json({
      dev: "Vinzz Official",
      status: false,
      error: "username, message, total required"
    });
  }

  let counter = 0;
  const successLogs = [];
  const errorLogs = [];
  const allLogs = [];

  for (let i = 0; i < total; i++) {
    try {
      const date = new Date();
      const formattedDate = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const deviceId = crypto.randomBytes(21).toString("hex");

      const url = "https://ngl.link/api/submit";
      const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Referer": `https://ngl.link/${username}`,
        "Origin": "https://ngl.link"
      };

      const body = `username=${username}&question=${message}&deviceId=${deviceId}&gameSlug=&referrer=`;

      const response = await fetch(url, { method: "POST", headers, body });

      if (response.status === 200) {
        counter++;
        successLogs.push(`Pengiriman #${counter}`);
        allLogs.push({ success: `Pengiriman #${counter}` });
      } else {
        errorLogs.push(`Err Status: ${response.status}`);
        allLogs.push({ error: `Err Status: ${response.status}` });
      }
    } catch (err) {
      errorLogs.push(`Err: ${err.message}`);
      allLogs.push({ error: `Err: ${err.message}` });
    }
  }

  res.status(200).json({
    dev: "Vinzz Official",
    status: counter > 0,
    totalSent: counter,
    success: successLogs,
    error: errorLogs,
    logs: allLogs
  });
}
