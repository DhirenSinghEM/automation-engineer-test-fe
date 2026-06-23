import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
    constructor(page) {
        super(page);

        this.welcomeText = page.getByText(/Welcome,/);
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.pageHeading = page.getByRole('heading', { name: 'Your Shifts' });
    }

    /**
     * Confirms the dashboard is showing by checking for the authenticated
     * nav state (welcome text + logout button)
     */
    async expectLoggedIn(timeout = 5000) {
        await expect(this.welcomeText).toBeVisible({ timeout });
        await expect(this.logoutButton).toBeVisible({ timeout });
    }

    async expectNotLoggedIn(timeout = 5000) {
        await expect(this.welcomeText).not.toBeVisible({ timeout });
    }    

    async logout() {
        await this.clickWhenVisible(this.logoutButton);
    }

    /**
    * Reads the persisted auth token directly from localStorage.
    * 
    */
    async getAuthToken() {
        return this.page.evaluate(() => {
            const raw = localStorage.getItem('user');
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed?.state?.user?.authToken ?? null;
        });
    }


}