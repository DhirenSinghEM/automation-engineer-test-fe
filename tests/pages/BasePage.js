/**
 * BasePage
 *
 * Holds the shared Playwright `page` reference and common helper methods
 * that every Page Object can reuse. Browser/context lifecycle (launch,
 * close, isolation) is intentionally NOT handled here — that's already
 * managed by the Playwright Test runner via its built-in `page` fixture.
 * Re-implementing launch/close here would create a second, conflicting
 * lifecycle alongside the runner's own.
 */

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to baseURL (configured in playwright.config.js and controlled via .env)
   */
  async goto(path = '/') {
    await this.page.goto(path);
  }

  /**
   * Get the current page title
   */
  async getTitle() {
    return this.page.title();
  }

  /**
   * Wait for a locator to be visible within an optional timeout
   */
  async waitForVisible(locator, timeout = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click a locator only after confirming it's visible (reduces flakiness)
   */
  async clickWhenVisible(locator, timeout = 5000) {
    await this.waitForVisible(locator, timeout);
    await locator.click();
  }

  /**
   * Fill a field only after confirming it's visible
   */
  async fillWhenVisible(locator, value, timeout = 5000) {
    await this.waitForVisible(locator, timeout);
    await locator.fill(value);
  }

  /**
   * Get trimmed text content from a locator
   */
  async getText(locator) {
    return (await locator.textContent())?.trim();
  }

  /**
   * Check visibility without throwing if the element doesn't exist
   */
  async isVisible(locator) {
    return locator.isVisible();
  }

  /**
   * Get current page URL
   */
  getCurrentURL() {
    return this.page.url();
  }
}