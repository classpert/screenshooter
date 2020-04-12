// server.js
const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

// mimic urlbox io api, api_key and format are ignored
app.get("/v1/:api_key/:format", async (req, res) => {
  const { url, width, height, quality } = req.query;

  if (!url || url.length === 0) {
    return res.json({ error: "url query parameter is required" });
  }

  const imageData = await Screenshot(
    url,
    width,
    height,
    quality,
    req.params.format
  );

  res.set("Content-Type", `image/${req.params.format}`);
  res.set("Content-Length", imageData.length);
  res.send(imageData);
});

app.listen(process.env.PORT || 3000);

async function Screenshot(url, width, height, quality, format) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--start-fullscreen",
      "--start-maximized"
    ],
    defaultViewport: null
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

  let screenshotOptions = {
    encoding: "binary",
    type: format,
    fullPage: true
  };

  if (format === "jpeg") {
    screenshotOptions.quality = parseInt(quality) || 100;
  }

  const screenData = await page.screenshot(screenshotOptions);

  await page.close();
  await browser.close();

  // Binary data of an image
  return screenData;
}
