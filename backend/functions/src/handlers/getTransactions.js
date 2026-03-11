/**
 * Handler: getTransactions
 * GET /transactions
 *
 * Returns the paginated transaction history for the authenticated user,
 * ordered by date descending.
 *
 * Query params:
 *   limit  {number}  Max results to return (default: 50, max: 200)
 *
 * Returns 200 with an array of transactions.
 */

const admin = require("firebase-admin");

const db = admin.firestore();

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getTransactions(req, res) {
  const MAX_LIMIT = 200;
  const DEFAULT_LIMIT = 50;
  const limit = Math.min(
    parseInt(req.query.limit, 10) || DEFAULT_LIMIT,
    MAX_LIMIT,
  );

  try {
    const snapshot = await db
      .collection("transactions")
      .where("userId", "==", req.user.uid)
      .orderBy("date", "desc")
      .limit(limit)
      .get();

    const transactions = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description || null,
        date: data.date && data.date.toDate ? data.date.toDate().toISOString() : data.date,
        createdAt: data.createdAt && data.createdAt.toDate
          ? data.createdAt.toDate().toISOString()
          : null,
        userId: data.userId,
      };
    });

    return res.status(200).json({
      transactions,
      count: transactions.length,
    });
  } catch (err) {
    console.error("[getTransactions] Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = { getTransactions };
