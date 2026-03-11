/**
 * Transaction Validator
 * Validates request body for createTransaction and updateTransaction.
 */

const VALID_TYPES = ["income", "expense"];

/**
 * Validates body for creating a new transaction.
 * @param {object} body - Request body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateCreate(body) {
  const errors = [];

  if (!body.type || !VALID_TYPES.includes(body.type)) {
    errors.push(`"type" is required and must be one of: ${VALID_TYPES.join(", ")}.`);
  }

  if (body.amount === undefined || body.amount === null) {
    errors.push('"amount" is required.');
  } else if (typeof body.amount !== "number" || body.amount <= 0) {
    errors.push('"amount" must be a positive number.');
  }

  if (!body.category || typeof body.category !== "string" || body.category.trim() === "") {
    errors.push('"category" is required and must be a non-empty string.');
  }

  if (!body.date) {
    errors.push('"date" is required.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates body for updating an existing transaction.
 * Only allows editing amount, category, description.
 * @param {object} body - Request body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateUpdate(body) {
  const errors = [];
  const ALLOWED_FIELDS = ["amount", "category", "description"];

  const providedFields = Object.keys(body);
  const forbiddenFields = providedFields.filter((f) => !ALLOWED_FIELDS.includes(f));

  if (forbiddenFields.length > 0) {
    errors.push(`Fields not allowed to be updated: ${forbiddenFields.join(", ")}.`);
  }

  if (providedFields.length === 0) {
    errors.push("At least one field must be provided for update.");
  }

  if (body.amount !== undefined) {
    if (typeof body.amount !== "number" || body.amount <= 0) {
      errors.push('"amount" must be a positive number.');
    }
  }

  if (body.category !== undefined) {
    if (typeof body.category !== "string" || body.category.trim() === "") {
      errors.push('"category" must be a non-empty string.');
    }
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      errors.push('"description" must be a string.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = { validateCreate, validateUpdate };
