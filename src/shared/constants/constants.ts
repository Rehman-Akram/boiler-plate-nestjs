export const JWT_SECRET = 'JWT_SECRET';
export const ACCESS_TOKEN_EXPIRY_TIME_IN_HOURS = 'ACCESS_TOEKN_EXPIRY_TIME_IN_HOURS';
export const ERRORS = {
  RESOURCE_NOT_FOUND: 'Resource not found.',
  PASSWORD_MISMATCHED: "The provided password does not match the user's password.",
  RESOURCE_ALREADY_EXISTS: 'Rosource already exists.',
  INVALID_TOKEN: 'Token is invalid',
  BAD_REQUEST: 'Bad request',
  UN_AUTHORIZED: 'You are un authorized to perform this action',
  TOKEN_NOT_FOUND: 'Token not found',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already Exists with same phone number or email address',
};
export const REGEX = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
};
export const MESSAGES = {
  USER_CREATED_SUCCESSFULLY: 'User created successfully',
  USER_LOGGED_IN_SUCCESSFULLY: 'User logged in successfully',
};
