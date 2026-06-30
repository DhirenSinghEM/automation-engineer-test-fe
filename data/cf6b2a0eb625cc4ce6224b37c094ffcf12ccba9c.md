# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: authState.spec.js >> Auth State >> user can logout and session is cleared @regression
- Location: tests/specs/authState.spec.js:43:5

# Error details

```
TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications Alt+T"
  - generic [ref=e4]:
    - navigation [ref=e5]:
      - generic [ref=e6]:
        - link "Orta Shift Manager" [ref=e8] [cursor=pointer]:
          - /url: /
          - generic [ref=e9]:
            - img [ref=e11]
            - generic [ref=e13]: Orta Shift Manager
        - list [ref=e14]:
          - generic [ref=e15]:
            - link "Login" [ref=e16] [cursor=pointer]:
              - /url: /login
            - button "Register" [ref=e17] [cursor=pointer]
    - main [ref=e19]:
      - generic [ref=e22]:
        - img "Shift Planning" [ref=e24]
        - generic [ref=e25]:
          - heading "Shift Manager Login" [level=2] [ref=e26]
          - generic [ref=e27]: Request timeout
          - generic [ref=e28]:
            - generic [ref=e30]:
              - generic [ref=e31]: Email*
              - generic [ref=e32]:
                - img [ref=e33]
                - textbox "Email Email*" [ref=e37]:
                  - /placeholder: Enter your email
                  - text: john@example.com
            - generic [ref=e39]:
              - generic [ref=e40]: Password*
              - generic [ref=e41]:
                - img [ref=e42]
                - textbox "Password Password*" [ref=e46]:
                  - /placeholder: Enter your password
                  - text: StrongPass123!
                - button [ref=e47] [cursor=pointer]:
                  - img
            - button "Login" [ref=e48] [cursor=pointer]
            - generic [ref=e49]:
              - paragraph [ref=e50]:
                - button "Forgot your password?" [ref=e51] [cursor=pointer]
              - paragraph [ref=e52]:
                - text: Don't have an account?
                - button "Register here" [ref=e53] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { LoginPage } from '../pages/LoginPage.js';
  3  | import { DashboardPage } from '../pages/DashboardPage.js';
  4  | import { config } from '../utils/config.js';
  5  | 
  6  | test.describe('Auth State', () => {
  7  |     let loginPage;
  8  |     let dashboardPage;
  9  | 
  10 |     test.beforeEach(async ({ page }) => {
  11 |         loginPage = new LoginPage(page);
  12 |         dashboardPage = new DashboardPage(page);
  13 |     });
  14 | 
  15 |     test('logged-in session persists after page reload @smoke @regression', async ({ page }) => {
  16 |         await loginPage.navigate();
  17 |         await loginPage.login(config.users.admin.email, config.users.admin.password);
  18 |         await expect(page).toHaveURL(/\/$/, { timeout: 10000 });
  19 |         await dashboardPage.expectLoggedIn();
  20 | 
  21 |         await expect.poll(() => dashboardPage.getAuthToken(), { timeout: 5000 }).toBeTruthy();
  22 |         const tokenBeforeReload = await dashboardPage.getAuthToken();
  23 | 
  24 |         await page.reload();
  25 | 
  26 |         // After reload, the app should read the persisted auth state from
  27 |         // localStorage and keep the user logged in
  28 |         await dashboardPage.expectLoggedIn();
  29 | 
  30 |         // Also confirm the underlying token survived the reload and is unchanged.
  31 |         await expect.poll(() => dashboardPage.getAuthToken(), { timeout: 5000 }).toBeTruthy();
  32 |         const tokenAfterReload = await dashboardPage.getAuthToken();
  33 |         expect(tokenAfterReload).toBe(tokenBeforeReload);
  34 |     });
  35 | 
  36 |     test('unauthenticated user sees the login page, not the dashboard @regression', async ({ page }) => {
  37 |         await loginPage.navigate();
  38 | 
  39 |         await loginPage.expectDisplayed();
  40 |         await dashboardPage.expectNotLoggedIn();
  41 |     });
  42 | 
  43 |     test('user can logout and session is cleared @regression', async ({ page }) => {
  44 |         await loginPage.navigate();
  45 |         await loginPage.login(config.users.admin.email, config.users.admin.password);
  46 | 
> 47 |         await page.waitForURL(/\/$/, { timeout: 10000 });
     |                    ^ TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
  48 |         await dashboardPage.expectLoggedIn();
  49 |         await expect.poll(() => dashboardPage.getAuthToken(), { timeout: 5000 }).toBeTruthy();
  50 | 
  51 |         await dashboardPage.logout();
  52 | 
  53 |         // Logout should both update the UI back to the logged-out state and clear the persisted token
  54 |         await loginPage.expectDisplayed();
  55 |         await dashboardPage.expectNotLoggedIn();
  56 | 
  57 |         const tokenAfterLogout = await dashboardPage.getAuthToken();
  58 |         expect(tokenAfterLogout).toBeFalsy();
  59 |     });
  60 | 
  61 | });
```