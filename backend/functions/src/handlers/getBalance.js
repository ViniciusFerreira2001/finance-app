/**
 * Handler: getBalance
 * GET /transactions/balance
 *
 * Dynamically calculates the current balance for the authenticated user
 * by summing all income and subtracting all expenses.
 * The balance is NEVER stored as a fixed field — it is always computed live.
 *
 * Returns 200 with:
 *   balance      {number}  totalIncome - totalExpense
 *   totalIncome  {number}  Sum of all income transactions
 *   totalExpense {number}  Sum of all expense transactions
 *   count        {number}  Total number of transactions evaluated
 */

const admin = require("firebase-admin");

const db = admin.firestore();

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getBalance(req, res) {
  try {
    // Fetch all income transactions for this user
    const [incomeSnap, expenseSnap] = await Promise.all([
      db
        .collection("transactions")
        .where("userId", "==", req.user.uid)
        .where("type", "==", "income")
        .get(),
      db
        .collection("transactions")
        .where("userId", "==", req.user.uid)
        .where("type", "==", "expense")
        .get(),
    ]);

    const totalIncome = incomeSnap.docs.reduce(
      (sum, doc) => sum + (doc.data().amount || 0),
      0,
    );

    const totalExpense = expenseSnap.docs.reduce(
      (sum, doc) => sum + (doc.data().amount || 0),
      0,
    );

    const balance = totalIncome - totalExpense;

    return res.status(200).json({
      balance: parseFloat(balance.toFixed(2)),
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      count: incomeSnap.size + expenseSnap.size,
    });
  } catch (err) {
    console.error("[getBalance] Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = { getBalance };
