// Maps raw MySQL/MariaDB driver error codes to clean, user-facing responses
// instead of leaking a 500 + stack trace for things that are really 400s.
const DB_ERROR_MAP = {
  ER_NO_REFERENCED_ROW_2: { status: 400, code: 'VALIDATION_ERROR', message: 'One of the referenced values does not exist.' },
  ER_NO_REFERENCED_ROW: { status: 400, code: 'VALIDATION_ERROR', message: 'One of the referenced values does not exist.' },
  ER_DUP_ENTRY: { status: 409, code: 'DUPLICATE', message: 'This record already exists.' },
  ER_CHECK_CONSTRAINT_VIOLATED: { status: 400, code: 'VALIDATION_ERROR', message: 'The submitted data violates a data rule.' },
};

function errorHandler(err, req, res, next) {
  const mapped = DB_ERROR_MAP[err.code];
  const status = mapped?.status || err.status || 500;
  const code = mapped?.code || err.code || (status === 500 ? 'INTERNAL_ERROR' : 'ERROR');
  const message = mapped?.message || (status === 500 ? 'Something went wrong.' : err.message);

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ error: { code, message } });
}

module.exports = errorHandler;
