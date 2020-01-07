import { browser } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  async getDocumentTitle(): Promise<string> {
    return await browser.getTitle();
  }
}
