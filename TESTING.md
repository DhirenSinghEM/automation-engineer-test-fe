# Frontend UI Automation Testing Guide

## Overview

This document describes the frontend UI automation test suite built with **Playwright** for the Orta Shift Manager application. The suite covers authentication, registration, and authenticated user workflows.

**Test Framework**: Playwright (JavaScript)  
**Language**: JavaScript (TypeScript adoption available if needed)  
**Test Location**: `tests/` folder (separate from development code)  
**Configuration**: `playwright.config.js` (root level, integrates with app structure)  
**CI/CD**: GitHub Actions with HTML reporting  
**Reports**: https://dhirensinghem.github.io/automation-engineer-test-fe/

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Run Tests
```bash
# Run all tests
npm run test:e2e

# Run with UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test tests/specs/login.spec.js

# Run in debug mode
npx playwright test --debug

# Generate and view HTML report
npm run test:e2e:viewreport
```

### Environment Setup
Create `.env` file at root:
```
BASE_URL=https://automation-engineer-test-fe-ebon.vercel.app
TEST_ADMIN_EMAIL=john@example.com
TEST_ADMIN_PASSWORD=StrongPass123!
TEST_WORKER_EMAIL=testUser1@example.com
TEST_WORKER_PASSWORD=StrongPass123!
```

---

## Project Structure

```
automation-engineer-test-fe/
├── .env                          # Environment variables (local)
├── .env.example                  # Template for .env
├── playwright.config.js          # Playwright configuration
├── package.json                  # Dependencies & scripts
├── .github/
│   └── workflows/
│       └── playwright-tests.yml  # GitHub Actions CI/CD
└── tests/
    ├── pages/                    # Page Object Models
    │   ├── BasePage.js          # Base class with helper methods
    │   ├── LoginPage.js
    │   ├── RegisterPage.js
    │   └── DashboardPage.js
    ├── specs/                    # Test specifications
    │   ├── login.spec.js
    │   ├── registration.spec.js
    │   └── authState.spec.js
    ├── test-data/                # Test data & constants
    │   └── messages.js
    ├── utils/                    # Utility functions
    │   ├── config.js            # Configuration loader
    │   └── testDataGenerator.js # Data generation helpers
    └── fixtures/                 # Empty (future use)
```
- Automation related scripts written in main package.json file
- Similarly, main .gitignore & .env files used to accomodate automation related artifacts

---

## Test Architecture

### Page Object Model
All locators and page interactions are encapsulated in page classes:
- **BasePage**: Shared methods (`goto()`, `waitForVisible()`, `getText()`, `isVisible()`, etc.)
- **LoginPage**: Login form interaction & validation
- **RegisterPage**: Registration form interaction & validation
- **DashboardPage**: Dashboard state checks & logout

**Benefit**: Locators change in one place; tests remain stable.

### Test Structure
Each test file:
1. Imports page objects
2. Instantiates pages in `beforeEach`
3. Uses page objects to interact with app
4. Asserts on expected outcomes (no direct DOM access)

**Example**:
```javascript
test('user can login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('admin@example.com', 'StrongPass123!');
  expect(page).toHaveURL(/\/$/);
});
```

### Selector Strategy

**Selector Types Used**:
- `getByLabel()` - Accessible labels (most resilient)
- `getByRole()` - Semantic HTML roles
- `getByText()` - Text content
- Selector chaining
- Fallback: CSS/XPath when above insufficient

---

## Test Coverage

### Tests Included (10 total)

#### Login (4 tests)
- ✅ Valid admin credentials
- ✅ Valid worker credentials
- ✅ Invalid credentials (error message)
- ✅ Empty fields (validation)

#### Registration (3 tests)
- ✅ Valid, unique user registration
- ✅ Duplicate email (error message)
- ✅ Empty fields (validation)

#### Auth State (3 tests)
- ✅ Session persistence after page reload
- ✅ Unauthenticated user sees login page
- ✅ User logout & session clearance

### What's Tested
- **Happy paths**: Valid credentials, successful flows
- **Error handling**: Invalid input, duplicate users, empty fields
- **State management**: Login state, logout, session persistence
- **Page navigation**: Login page detection, URL changes
- **UI elements**: Button visibility, form submission, error messages

### Design Decisions (Trade-offs Documented)

#### 1. **Smoke/Regression Tagging**
- **Status**: Not implemented as separate folders
- **Reason**: Request volume (10 tests) doesn't justify complexity; folder-based filtering adds maintenance overhead
- **Future**: If test suite grows to 50+, implement `@smoke` / `@regression` tags + Newman folder-based filtering via CLI flags
- **Implementation when needed**:
  ```javascript
  test('@smoke user can login', async ({ page }) => { ... })
  test('@regression user can login', async ({ page }) => { ... })
  ```
  ```bash
  npx playwright test --grep "@smoke"
  ```

#### 2. **Multi-Environment Support**
- **Status**: Single `.env` for dev environment
- **Reason**: Vite build-time config + single test target sufficient for single environment
- **Future**: Extend via environment-specific config files
  ```
  .env.local      (development)
  .env.staging    (staging)
  .env.prod       (production)
  ```
  Then load via: `const env = process.env.ENV_FILE || '.env.local'`

#### 3. **Browser Coverage**
- **Chromium**: ✅ Enabled (primary browser)
- **Firefox**: 💬 Commented out (can enable anytime)
- **WebKit**: 💬 Commented out (can enable anytime)
- **Reason**: Single browser sufficient for core logic validation; parallel runs slow CI (3 browsers = 3x duration)
- **Enable in `playwright.config.js`**:
  ```javascript
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    // { name: 'firefox', use: devices['Desktop Firefox'] },
    // { name: 'webkit', use: devices['Desktop Safari'] },
  ]
  ```

#### 4. **Mobile Testing**
- **Status**: Not included in scope
- **Available**: Playwright supports mobile via device profiles
- **Future**: Add mobile devices if needed:
  ```javascript
  { name: 'Mobile Chrome', use: devices['Pixel 5'] },
  { name: 'Mobile Safari', use: devices['iPhone 12'] },
  ```

---

## Running Tests

### Local Execution

**All tests (headless mode)**:
```bash
npm run test:e2e
```

**All tests (headed mode - browser visible)**:
```bash
npx playwright test --headed
```

**Specific test file**:
```bash
npx playwright test tests/specs/login.spec.js
```

**Specific test by name**:
```bash
npx playwright test -g "user can login"
```

**Debug mode** (step through with inspector):
```bash
npx playwright test --debug
```

**UI Mode** (interactive test explorer):
```bash
npx playwright test --ui
```

**Generate and view HTML report**:
```bash
npm run test:e2e:report
```

### CI/CD Execution

**GitHub Actions** runs tests automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual trigger via Actions tab

**Secrets required** (Settings → Secrets):
- `TEST_ADMIN_EMAIL`
- `TEST_ADMIN_PASSWORD`
- `TEST_WORKER_EMAIL`
- `TEST_WORKER_PASSWORD`

**View Results**:
- GitHub Actions tab → latest run
- Download artifact: `playwright-report-{run-number}`
- Extract and open `index.html`
- View on GitHub Pages: https://dhirensinghem.github.io/automation-engineer-test-fe/

---

## Test Reports

### Local HTML Report
```bash
npm run test:e2e:report
```
Opens interactive report at `playwright-report/index.html` showing:
- Per-test pass/fail status
- Screenshots on failure
- Video recordings (if enabled)
- Full execution traces

### CI/CD Reports
- **Upload location**: `postman/reports/` (artifact)
- **GitHub Pages**: https://dhirensinghem.github.io/automation-engineer-test-fe/
- **Retention**: 30 days (configurable)

---

## Best Practices

1. **Use Page Objects** — Never query DOM directly in tests
2. **Explicit Waits** — Use `waitForVisible()` instead of fixed `sleep()`
3. **Avoid Flakiness** — Use `toContainText()` with retries instead of `getText()`
4. **Isolate Tests** — Each test should be independent; don't rely on test order
5. **Meaningful Assertions** — Assert on business outcomes, not implementation details
6. **Keep Data Fresh** — Use `testDataGenerator.generateUniqueEmail()` to avoid collisions
7. **Environment Variables** — Never hardcode credentials; use `.env`

---

## Extending the Suite

### Add a New Test
1. Create test file: `tests/specs/newFeature.spec.js`
2. Import page objects:
   ```javascript
   import { LoginPage } from '../pages/LoginPage.js';
   ```
3. Write test using page objects
4. Run: `npx playwright test tests/specs/newFeature.spec.js`

### Add New Page Object
1. Create: `tests/pages/NewPage.js`
2. Extend BasePage:
   ```javascript
   import { BasePage } from './BasePage.js';
   
   export class NewPage extends BasePage {
     constructor(page) {
       super(page);
     }
     
     get myElement() {
       return this.page.getByLabel('My Element');
     }
     
     async myAction() {
       await this.myElement.click();
     }
   }
   ```

### Add Helper Method to BasePage
```javascript
async expectErrorMessage(expectedText, timeout = 5000) {
  const errorLocator = this.page.locator('[role="alert"]');
  await expect(errorLocator).toContainText(expectedText, { timeout });
}
```

---

## Known Limitations & Future Work

### Current Limitations
1. **Single Browser**: Only Chromium; Firefox/WebKit commented out (enable if needed)
2. **No Mobile Tests**: Desktop only; mobile testing structure available
3. **No API Mocking**: Tests hit live backend; could add MSW for offline testing
4. **Manual Test Data**: Uses unique email generation; could use factory patterns
5. **No Accessibility Checks**: Axe-core not integrated; can add for a11y validation
6. **Limited Error Scenarios**: Happy paths + basic validation; edge cases limited

### Planned Enhancements
1. **Smoke/Regression Filtering** — Add when suite grows to 50+ tests
2. **Multi-Environment** — `.env.staging`, `.env.prod` variants
3. **Performance Testing** — Lighthouse metrics via Playwright
4. **Mobile & Cross-Browser** — Enable Firefox/WebKit in CI, add device profiles
5. **Accessibility Validation** — Integrate Axe-core
6. **Data Factory Pattern** — Replace string generation with object factories
7. **Visual Regression** — Screenshot diffing for UI consistency

---

## CI/CD Integration

### GitHub Actions Workflow
File: `.github/workflows/playwright-tests.yml`

**Triggers**:
- Push to main/develop
- PR to main/develop  
- Daily at 2 AM UTC
- Manual via Actions tab

**Features**:
- Automatic PR comment with results
- Artifact upload (30-day retention)
- GitHub Pages deployment
- Test reporter integration

**Fail on Error**: ✅ Enabled (PR merge blocked if tests fail)

---

## Related Documentation

- **CI/CD Setup**: `.github/workflows/playwright-tests.yml`
- **Environment Config**: `.env.example`
