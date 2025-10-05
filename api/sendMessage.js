import fetch from "node-fetch";
import crypto from "crypto";

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 Version/17.6 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/116.0.5845.110 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 Version/17.7 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:116.0) Gecko/20100101 Firefox/116.0",
  "Mozilla/5.0 (Android 14; Mobile; rv:116.0) Gecko/116.0 Firefox/116.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_1) AppleWebKit/605.1.15 Version/17.7 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edge/116.0.1938.69",
  "Mozilla/5.0 (Linux; Android 14; SM-G991B) AppleWebKit/537.36 Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (iPad; CPU OS 17_7 like Mac OS X) AppleWebKit/605.1.15 Version/17.7 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 Chrome/117.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 Version/16.7 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 Chrome/116.0.5845.121 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_7) AppleWebKit/605.1.15 Version/17.7 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116.0.5845.188 Safari/537.36",
  "Mozilla/5.0 (iPad; CPU OS 16_7 like Mac OS X) AppleWebKit/605.1.15 Version/16.7 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 13; SM-F936B) AppleWebKit/537.36 Chrome/116.0.5845.121 Mobile Safari/537.36"
];

function getRandomUA() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function sendRequest(username, message) {
  while (true) {
    const ua = getRandomUA();
    const deviceId = crypto.randomBytes(21).toString("hex");
    const headers = {
      "User-Agent": ua,
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

    try {
      const response = await fetch("https://ngl.link/api/submit", { method: "POST", headers, body });
      if (response.status === 200) return { success: true };
      // ganti UA + retry langsung kalau kena limit/error
    } catch (err) {
      // ganti UA otomatis, loop ulang
    }
  }
}

export default async function handler(req, res) {
  const username = req.query.username || req.body?.username;
  const message = req.query.message || req.body?.message;
  const total = parseInt(req.query.total || req.body?.total || "5");

  if (!username || !message || !total) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).send(JSON.stringify({
      dev: "Vinzz Official",
      status: false,
      error: "username, message, total required"
    }, null, 2));
  }

  let counter = 0;
  const successLogs = [];
  const errorLogs = [];
  const allLogs = [];

  for (let i = 0; i < total; i++) {
    const result = await sendRequest(username, message);
    if (result.success) {
      counter++;
      successLogs.push(`Pengiriman #${counter}`);
      allLogs.push({ success: `Pengiriman #${counter}` });
    }
  }

  const finalResponse = {
    dev: "Vinzz Official",
    status: counter > 0,
    totalSent: counter,
    success: successLogs,
    error: errorLogs,
    logs: allLogs
  };

  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(finalResponse, null, 2));
}
