import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        this.emailInput = page.getByLabel('Email', { exact: true });
        this.passwordInput = page.getByLabel('Password', { exact: true });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.heading = page.getByRole('heading', { name: 'Shift Manager Login' });        
        this.messageContent = page.locator('h2:has-text("Shift Manager Login") + div');
    }

    /**
     * Navigate to the login page and confirm we actually landed there
     * by asserting the URL.
     */
    async navigate() {
        await this.goto('/');
        await expect(this.page).toHaveURL(/.*\/$/);
    }

    /**
     * Confirms the login page/heading is visible. Used by other specs also.
     * 
     */
    async expectDisplayed(timeout = 5000) {
        await expect(this.heading).toBeVisible({ timeout });
    }

    async login(email, password) {
        await this.fillWhenVisible(this.emailInput, email);
        await this.fillWhenVisible(this.passwordInput, password);
        await this.clickWhenVisible(this.loginButton);
    }

    /**
     * Clicks Login without filling any fields first - used for the
     * empty-fields validation scenario.
     */
    async clickLogin() {
        await this.clickWhenVisible(this.loginButton);
    }

    /**
     * Reads the message content area text used to assert the success or error messages
     */
    async expectMessage(expectedText, timeout = 10000) {
        await expect(this.messageContent).toContainText(expectedText, { timeout });
    }

}