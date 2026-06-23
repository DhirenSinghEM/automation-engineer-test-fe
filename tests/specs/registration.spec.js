import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage.js';
import { config } from '../utils/config.js';
import { messages } from '../test-data/messages.js';
import { generateTestUser } from '../utils/testDataGenerator.js';

test.describe('Registration', () => {
  let registerPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigate();
  });

  test('user can register with valid, unique details @smoke @regression', async () => {
    const newUser = generateTestUser();

    await registerPage.register(newUser.name, newUser.email, newUser.password, newUser.password);
    await registerPage.expectMessage(messages.registration.success);
  });

  test('shows error when registering with an already-registered email @regression', async () => {
    // config.users.admin.email is a pre-existing seeded account, so this
    // reliably triggers the duplicate-user validation on every run.
    await registerPage.register(
      config.users.admin.name,
      config.users.admin.email,
      config.users.admin.password,
      config.users.admin.password
    );

    await registerPage.expectMessage(messages.registration.userAlreadyExists);
  });

  test('shows error when passwords do not match @regression', async () => {

    await registerPage.register(
      config.users.admin.name,
      config.users.admin.email,
      config.users.admin.password,
      config.users.admin.wrongPassword
    );

    await registerPage.expectMessage(messages.registration.passwordMismatch);
  });

  test('shows validation error for empty fields @regression', async () => {
    await registerPage.clickRegister();
    await registerPage.expectMessage(messages.registration.allFieldsRequired);
  });
});