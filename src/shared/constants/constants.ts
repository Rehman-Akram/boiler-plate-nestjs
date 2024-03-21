export const JWT_SECRET = 'JWT_SECRET';
export const ACCESS_TOKEN_EXPIRY_TIME = 'ACCESS_TOKEN_EXPIRY_TIME';
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
  USERS_EXIST_WITH_ROLE: 'Role is assigned to users, please remove role from users first',
  DELETED_USER: 'User exist, but deleted please contact admin',
  USER_PENDING: 'User status is pending, please accept invite or contact admin',
  USER_NOT_PENDING: 'User dont have pending invite',
};
export const REGEX = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
};
export const MESSAGES = {
  USER_CREATED_SUCCESSFULLY: 'User created successfully',
  USER_LOGGED_IN_SUCCESSFULLY: 'User logged in successfully',
  QUERY_SUCCESS: 'Query executed successfully',
  INVITE_VERIFIED: 'Invite verified successfully',
  EMAIL_SENT: 'Email sent successfully',
  RESOURCE_CREATED_SUCCESSFULLY: 'Resource created successfully',
  SIGNED_URL_FETCHED: 'Signed URL successfully fetched',
  PREVIEW_SIGNED_URL_FETCHED: 'Preview signed url fetched successfully.',
  PASSWORD_UPDATED_SUCCESSFULLY: 'Password updated successfully',
  INVITE_RESEND: 'Please find your resent invite link below',
};

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
};

export const PERMISSIONS = {
  USERS: 'userPermissions',
  ROLES: 'rolePermissions',
};
export const EMAIL_TEMPLATES = {
  NEW_USER_EMAIL_TEMPLATE: 'newUserEmailTemplate',
};
export const EMAIL_SUBJECTS = {
  NEW_USER_CREATE: 'Welcome to Al Jazi',
};
