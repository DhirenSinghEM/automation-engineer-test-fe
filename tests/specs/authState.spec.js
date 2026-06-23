import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { config } from '../utils/config.js';

test.describe('Auth State', () => {
    let loginPage;
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
    });

    test('logged-in session persists after page reload @smoke @regression', async ({ page }) => {
        await loginPage.navigate();
        await loginPage.login(config.users.admin.email, config.users.admin.password);
        await expect(page).toHaveURL(/\/$/, { timeout: 10000 });
        await dashboardPage.expectLoggedIn();

        await expect.poll(() => dashboardPage.getAuthToken(), { timeout: 5000 }).toBeTruthy();
        const tokenBeforeReload = await dashboardPage.getAuthToken();

        await page.reload();

        // After reload, the app should read the persisted auth state from
        // localStorage and keep the user logged in
        await dashboardPage.expectLoggedIn();

        // Also confirm the underlying token survived the reload and is unchanged.
        await expect.poll(() => dashboardPage.getAuthToken(), { timeout: 5000 }).toBeTruthy();
        const tokenAfterReload = await dashboardPage.getAuthToken();
        expect(tokenAfterReload).toBe(tokenBeforeReload);
    });

    test('unauthenticated user sees the login page, not the dashboard @regression', async ({ page }) => {
        await loginPage.navigate();

        await loginPage.expectDisplayed();
        await dashboardPage.expectNotLoggedIn();
    });

    test('user can logout and session is cleared @regression', async ({ page }) => {
        await loginPage.navigate();
        await loginPage.login(config.users.admin.email, config.users.admin.password);

        await page.waitForURL(/\/$/, { timeout: 10000 });
        await dashboardPage.expectLoggedIn();
        await expect.poll(() => dashboardPage.getAuthToken(), { timeout: 5000 }).toBeTruthy();

        await dashboardPage.logout();

        // Logout should both update the UI back to the logged-out state and clear the persisted token
        await loginPage.expectDisplayed();
        await dashboardPage.expectNotLoggedIn();

        const tokenAfterLogout = await dashboardPage.getAuthToken();
        expect(tokenAfterLogout).toBeFalsy();
    });

});