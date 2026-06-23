import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class RegisterPage extends BasePage {
  constructor(page) {
    super(page);

    this.nameInput = page.getByLabel('Name', { exact: true });
    this.emailInput = page.getByLabel('Email', { exact: true });
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm Password', { exact: true });
    // Scoped to <main> because the page also has a "Register" button in the nav bar at the top of the page
    this.registerButton = page.getByRole('main').getByRole('button', { name: 'Register', exact: true });
    this.messageContent = page.locator('h2:has-text("Register for Shift Manager") + div');
  }

  /**
   * Navigate to the registration page and confirm we landed there by
   * asserting on the visible heading.
   */
  async navigate() {
    await this.goto('/');
    await this.page.getByRole('link', { name: 'Orta Shift Manager' }).waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'Register', exact: true }).first().click();
    await expect(this.page.getByRole('heading', { name: 'Register for Shift Manager' })).toBeVisible();
  }

  async register(name, email, password, confirmPassword) {
    await this.fillWhenVisible(this.nameInput, name);
    await this.fillWhenVisible(this.emailInput, email);
    await this.fillWhenVisible(this.passwordInput, password);
    await this.fillWhenVisible(this.confirmPasswordInput, confirmPassword);
    await this.clickWhenVisible(this.registerButton);
  }

  /**
   * Clicks Register without filling any fields first - used for the
   * empty-fields validation scenario.
   */
  async clickRegister() {
    await this.clickWhenVisible(this.registerButton);
  }

  /**
   * Asserts the message banner eventually contains the expected text.
   * 
   */
  async expectMessage(expectedText, timeout = 5000) {
    await expect(this.messageContent).toContainText(expectedText, { timeout });
  }
}