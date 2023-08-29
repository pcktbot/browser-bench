const puppeteer = require('puppeteer');

class Crawler {
  constructor (params) {
    this.browser = null;
    this.page = null;
    this.config = {
      args: ["--no-sandbox", "--enable-gpu"],
      headless: false,
      ignoreHTTPSErrors: true,
      waitUntil: "networkidle2"
    };
    this._succeeded = [];
    this._failed = [];
  }

  get succeeded () { return this._succeeded; }
  set succeeded (value) { this._succeeded.push(value); }
  get failed () { return this._failed; }
  set failed (value) { this._failed.push(value); }

  async run (creds) {
    for (const cred of creds) {
      console.info(`Testing ${cred.description}...`);
      await this.openBrowser(this.config);
      await this.openPage();
      await this.navigateTo(cred.entrypoint);
      await this.login(cred);
      // any issues here are probably password related, and this user needs to be skipped
      await this.sortResult(cred);
      await this.closePage();
      await this.closeBrowser();
    }
    return this.surfaceResults();
  }

  async openBrowser (config = this.config) {
    this.browser = await puppeteer.launch(config);
  }

  async openPage () {
    this.page = await this.browser.newPage();
  }

 async navigateTo (entrypoint) {
    await this.page.goto(entrypoint, { timeout: 0 });
  }

  async waitForNavigation () {
    await this.page.waitForNavigation();
  }

  async sortResult (cred) {
    const url = this.page.url();
    cred.result_url = url;
    if (cred.should_have_access && cred.entrypoint === url) {
      this.succeeded = cred;
    } else if (!cred.should_have_access && cred.entrypoint !== url) {
      this.succeeded = cred;
    } else {
      this.failed = cred;
    }
  }
  
  async closePage () {
    await this.page.close();
  }

  async closeBrowser () {
    await this.browser.close();
  }

  async login (cred) {
    // should we store the CSS selector for the login markup in a separate config?
    await this.page.locator("input#Username").fill(cred.username);
    this.page.click("button[type='submit']");
    await this.waitForNavigation();
    await this.page.locator("input#Password").fill(cred.password);
    this.page.click("button[type='submit']");
    await this.waitForNavigation();
  }

  surfaceResults () {
    return {
      succeeded: this.succeeded,
      failed: this.failed
    }
  }

}

module.exports = Crawler;
