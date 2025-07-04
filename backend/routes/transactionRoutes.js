import express from "express";
import { getSpendingBreakdown, getIncomeOverview } from "../controllers/transactionController.js";
import { getTransactions, addTransaction, editTransaction, deleteTransaction } from "../controllers/mockTransactionController.js";
import authenticate from "../middleware/auth.js";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
import { processReceipt, parseReceipt } from '../controllers/receiptController.js';

const router = express.Router();

router.get("/spending-breakdown", authenticate, getSpendingBreakdown);
router.get("/income", authenticate, getIncomeOverview);

// Mock CRUD endpoints for transactions
router.get("/transactions", authenticate, getTransactions);
router.post("/transactions", authenticate, addTransaction);
router.put("/transactions/:id", authenticate, editTransaction);
router.delete("/transactions/:id", authenticate, deleteTransaction);

router.post('/receipt/ocr', upload.single('receipt'), processReceipt);
router.post('/parse-receipt', parseReceipt);

export default router;
