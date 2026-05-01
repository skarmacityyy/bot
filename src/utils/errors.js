export class AppError extends Error { constructor(message, code = 'APP_ERROR', status = 400) { super(message); this.code = code; this.status = status; } }
export class PermissionError extends AppError { constructor(msg = 'Insufficient permission') { super(msg, 'PERMISSION_ERROR', 403); } }
export class ValidationError extends AppError { constructor(msg = 'Validation failed') { super(msg, 'VALIDATION_ERROR', 400); } }
