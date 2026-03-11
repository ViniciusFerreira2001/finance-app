/**
 * Handler: deleteTransaction
 * DELETE /transactions/:id
 *
 * Deletes a transaction belonging to the authenticated user.
 * Returns 403 if the document exists but belongs to another user.
 * Returns 404 if the document does not exist.
 * Returns 204 on successful deletion.
 */

const admin = require("firebase-admin");

const db = admin.firestore();

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deleteTransaction(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required." });
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

    await docRef.delete();

    return res.status(204).send();
  } catch (err) {
    console.error("[deleteTransaction] Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = { deleteTransaction };
