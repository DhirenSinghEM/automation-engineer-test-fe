import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { config } from '../utils/config.js';
import { messages } from '../test-data/messages.js';

test.describe('Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('user can login with valid admin credentials @smoke @regression', async () => {
    await loginPage.login(config.users.admin.email, config.users.admin.password);

    await loginPage.expectMessage(messages.login.success);
  });

  test('user can login with valid worker credentials @regression', async () => {
    await loginPage.login(config.users.worker.email, config.users.worker.password);

    await loginPage.expectMessage(messages.login.success);
  });

  test('shows error for invalid credentials @regression', async () => {
    await loginPage.login(config.users.admin.email, config.users.admin.wrongPassword);

    await loginPage.expectMessage(messages.login.invalidCredentials);
  });

  test('shows validation error for empty fields @regression', async () => {
    await loginPage.clickLogin();

    await loginPage.expectMessage(messages.login.allFieldsRequired);
  });
});