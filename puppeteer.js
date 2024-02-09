const puppeteer = require('puppeteer');

/**
 * input#Username
 * button[type="submit"]
 * 
 */
class Crawler {
  constructor (params) {
    this.browser = null;
    this.page = null;
    this.config = {};
    this._suceeded = [];
    this._failed = [];
  }

  get suceeded () { return this._suceeded; }
  set suceeded (value) { this._suceeded.push(value); }
  get failed () { return this._failed; }
  set failed (value) { this._failed.push(value); }

  async run (creds) {
    for (const cred of creds) {
      await this.openBrowser();
      await this.openPage();
      await this.navigateTo(cred.entrypoint);
      await this.login(cred);
      await this.waitForNavigation();
      await this.sortResult();
      await this.closePage();
      await this.closeBrowser();
      this.surfaceResults();
    }
  }

  async openBrowser () {
    this.browser = await puppeteer.launch(this.config);
  }

  async openPage () {
    this.page = await this.browser.newPage();
  }

 async navigateTo (entrypoint) {
    await this.page.goto(entrypoint);
  }

  async waitForNavigation () {
    await this.page.waitForNavigation();
  }

  async sortResult () {}
  
  async closePage () {
    await this.page.close();
  }

  async closeBrowser () {
    await this.browser.close();
  }

  async login () {
    // should we store the CSS selector for the login markup in a separate config?
  }

  surfaceResults () {
    return {
      suceeded: this.suceeded,
      failed: this.failed
    }
  }

}

module.exports = Crawler;
