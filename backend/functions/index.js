/**
 * Finance App – Cloud Functions Entry Point
 *
 * Sets up an Express app that exposes the following REST API:
 *
 *   POST   /transactions           → createTransaction
 *   GET    /transactions           → getTransactions
 *   GET    /transactions/balance   → getBalance
 *   PATCH  /transactions/:id       → updateTransaction
 *   DELETE /transactions/:id       → deleteTransaction
 *
 * All routes require a valid Firebase Auth token in the Authorization header.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Handlers
const { createTransaction } = require("./src/handlers/createTransaction");
const { getTransactions } = require("./src/handlers/getTransactions");
const { getBalance } = require("./src/handlers/getBalance");
const { deleteTransaction } = require("./src/handlers/deleteTransaction");
const { updateTransaction } = require("./src/handlers/updateTransaction");

// Middleware
const { authenticate } = require("./src/middleware/auth");

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// Auth: all routes below require a valid Firebase ID token
app.use(authenticate);

// Routes
app.post("/transactions", createTransaction);
app.get("/transactions/balance", getBalance); // must come BEFORE /transactions/:id
app.get("/transactions", getTransactions);
app.patch("/transactions/:id", updateTransaction);
app.delete("/transactions/:id", deleteTransaction);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Export as a single Cloud Function in the southamerica-east1 region (São Paulo)
exports.api = functions
  .region("southamerica-east1")
  .https.onRequest(app);
