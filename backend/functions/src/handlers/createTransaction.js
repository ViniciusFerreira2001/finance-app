/**
 * Handler: createTransaction
 * POST /transactions
 *
 * Creates a new income or expense transaction for the authenticated user.
 *
 * Body:
 *   type        {string}  "income" | "expense"
 *   amount      {number}  Positive number
 *   category    {string}  e.g. "Salary", "Food"
 *   description {string}  (optional) Free text
 *   date        {string}  ISO 8601 date string
 *
 * Returns 201 with the created document.
 */

const admin = require("firebase-admin");
const { validateCreate } = require("../validators/transaction");

const db = admin.firestore();

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function createTransaction(req, res) {
  const { valid, errors } = validateCreate(req.body);
  if (!valid) {
    return res.status(400).json({ error: "Validation failed", messages: errors });
  }

  const { type, amount, category, description, date } = req.body;

  try {
    const newDoc = {
      type,
      amount,
      category: category.trim(),
      description: description ? String(description).trim() : null,
      date: new Date(date),
      userId: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("transactions").add(newDoc);

    return res.status(201).json({
      id: docRef.id,
      ...newDoc,
      date: newDoc.date.toISOString(),
      createdAt: new Date().toISOString(), // approximation; Firestore resolves on server
    });
  } catch (err) {
    console.error("[createTransaction] Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = { createTransaction };
