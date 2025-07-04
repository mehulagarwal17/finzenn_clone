import axios from 'axios';
import fs from 'fs';
import path from 'path';

// You should store these securely (e.g., in environment variables)
const VERYFI_CLIENT_ID = process.env.VERYFI_CLIENT_ID || 'YOUR_CLIENT_ID';
const VERYFI_USERNAME = process.env.VERYFI_USERNAME || 'YOUR_USERNAME';
const VERYFI_API_KEY = process.env.VERYFI_API_KEY || 'YOUR_API_KEY';

console.log('Veryfi creds:', process.env.VERYFI_CLIENT_ID, process.env.VERYFI_USERNAME, process.env.VERYFI_API_KEY);

// POST /api/receipt/ocr
export async function processReceipt(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath, { encoding: 'base64' });

    const response = await axios.post(
      'https://api.veryfi.com/api/v7/partner/documents/',
      {
        file_data: fileData,
        file_name: path.basename(filePath),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'CLIENT-ID': VERYFI_CLIENT_ID,
          'AUTHORIZATION': `apikey ${VERYFI_USERNAME}:${VERYFI_API_KEY}`,
        },
      }
    );

    // Optionally delete the file after processing
    fs.unlinkSync(filePath);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function detectCategory(text) {
  const lower = text.toLowerCase();
  if (/(food|restaurant|cafe|pizza|burger|meal|dine|coffee|snack|hotel|menu|lunch|dinner|breakfast|beverage|juice|bar|bakery|sweets|ice cream)/.test(lower)) return "Food & Dining";
  if (/(electricity|power|energy|current|bill)/.test(lower)) return "Electricity";
  if (/(gas|lpg|cylinder|petrol|diesel|fuel|pump)/.test(lower)) return "Gas/Fuel";
  if (/(grocery|supermarket|mart|store|provision|vegetable|fruit|kirana)/.test(lower)) return "Groceries";
  if (/(pharmacy|medicine|hospital|clinic|doctor|health|medical|chemist)/.test(lower)) return "Health";
  if (/(mobile|recharge|internet|data|broadband|wifi|airtel|jio|vodafone|bsnl)/.test(lower)) return "Mobile/Internet";
  if (/(travel|taxi|uber|ola|bus|train|flight|ticket|cab|auto|transport)/.test(lower)) return "Travel/Transport";
  if (/(clothes|apparel|fashion|footwear|shirt|pant|jeans|dress|shopping|boutique)/.test(lower)) return "Shopping";
  return "Other";
}

// Parse receipt text using regex and heuristics
export function parseReceiptText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Try to get merchant from the first 1-3 lines
  const merchant = lines.slice(0, 3).join(' ');

  // 2. Try to find all possible dates (dd/mm/yyyy, mm/dd/yyyy, yyyy-mm-dd, dd-mm-yyyy, dd.mm.yyyy, dd mm yyyy)
  const dateRegex = /(\b\d{1,2}[\/\-.\s]\d{1,2}[\/\-.\s]\d{2,4}\b|\b\d{4}[\/\-.\s]\d{1,2}[\/\-.\s]\d{1,2}\b)/g;
  let dates = [];
  for (const line of lines) {
    const matches = line.match(dateRegex);
    if (matches) {
      dates.push(...matches);
    }
  }
  // Pick the last date found (often the transaction date)
  let date = dates.length > 0 ? dates[dates.length - 1] : '';

  // 3. Try to find the total amount
  const totalRegex = /(total|amount|grand total)[^\d]*(\d+[.,]?\d*)/i;
  let amount = '';
  for (const line of lines.slice().reverse()) { // Start from bottom
    const match = line.match(totalRegex);
    if (match) {
      amount = match[2] || match[1];
      break;
    }
  }

  // 4. Detect category
  const category = detectCategory(text);

  return { merchant, date, amount, category };
}

// POST /api/transactions/parse-receipt
export async function parseReceipt(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });
    const result = parseReceiptText(text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 