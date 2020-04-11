// server.js
const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

// /?url=https://google.com
app.get("/", async (req, res) => {
  const { url, width, height } = req.query;
  if (!url || url.length === 0) {
    return res.json({ error: "url query parameter is required" });
  }

  const imageData = await Screenshot(url, width, height);

  res.set("Content-Type", "image/jpeg");
  res.set("Content-Length", imageData.length);
  res.send(imageData);
});

app.listen(process.env.PORT || 3000);

async function Screenshot(url, width, height) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--start-fullscreen",
      "--start-maximized"
    ]
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: parseInt(width) || 1280,
    height: parseInt(height) || 1024
  });

  await page.goto(url, {
    timeout: 0,
    waitUntil: "networkidle0"
  });
  const screenData = await page.screenshot({
    encoding: "binary",
    type: "jpeg",
    quality: 100
  });

  await page.close();
  await browser.close();

  // Binary data of an image
  return screenData;
}
