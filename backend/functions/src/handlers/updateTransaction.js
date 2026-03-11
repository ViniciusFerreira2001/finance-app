/**
 * Handler: updateTransaction
 * PATCH /transactions/:id
 *
 * Updates allowed fields (amount, category, description) of a transaction
 * that belongs to the authenticated user.
 *
 * Body (all optional, at least one required):
 *   amount      {number}  Positive number
 *   category    {string}  Non-empty string
 *   description {string}  Free text
 *
 * Returns 200 with the updated document.
 */

const admin = require("firebase-admin");
const { validateUpdate } = require("../validators/transaction");

const db = admin.firestore();

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateTransaction(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required." });
  }

  const { valid, errors } = validateUpdate(req.body);
  if (!valid) {
    return res.status(400).json({ error: "Validation failed", messages: errors });
  }

  try {
    const docRef = db.collection("transactions").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    if (docSnap.data().userId !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden. You do not own this transaction." });
    }

    // Build the update payload with only allowed fields
    const updatePayload = {};
    if (req.body.amount !== undefined) updatePayload.amount = req.body.amount;
    if (req.body.category !== undefined) updatePayload.category = req.body.category.trim();
    if (req.body.description !== undefined) {
      updatePayload.description = req.body.description
        ? String(req.body.description).trim()
        : null;
    }

    await docRef.update(updatePayload);

    // Return the updated document
    const updatedSnap = await docRef.get();
    const data = updatedSnap.data();

    return res.status(200).json({
      id: updatedSnap.id,
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description || null,
      date: data.date && data.date.toDate ? data.date.toDate().toISOString() : data.date,
      createdAt: data.createdAt && data.createdAt.toDate
        ? data.createdAt.toDate().toISOString()
        : null,
      userId: data.userId,
    });
  } catch (err) {
    console.error("[updateTransaction] Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = { updateTransaction };
