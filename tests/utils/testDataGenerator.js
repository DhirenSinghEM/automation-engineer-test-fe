/**
 * Generates test data that needs to be unique per run - primarily to
 * avoid collisions with previously registered users when re-running
 * the registration tests against a live, shared backend.
 */

export function generateUniqueEmail(prefix = 'testuser') {
  const timestamp = Date.now();
  return `${prefix}+${timestamp}@example.com`;
}

export function generateTestUser(overrides = {}) {
  return {
    name: 'Test User',
    email: generateUniqueEmail(),
    password: 'StrongPass123!',
    ...overrides,
  };
}