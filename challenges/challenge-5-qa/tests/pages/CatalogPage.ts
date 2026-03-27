import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Catalog Page Object skeleton
 * Use Copilot to build this out. Inspect the eShop catalog page in your
 * browser, note the key elements (product cards, filters, pagination),
 * then ask Copilot to generate the page object following the BasePage pattern.
 */
export class CatalogPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    throw new Error('Not implemented');
  }

  async waitForLoad(): Promise<void> {
    throw new Error('Not implemented');
  }
}
