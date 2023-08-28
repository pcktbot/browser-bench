const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');

/**
 * input#Username
 * button[type="submit"]
 * 
 */

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
      console.log('running credentials', cred);
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
    console.log('opening browser');
    this.browser = await puppeteer.launch(config);
  }

  async openPage () {
    console.log('opening page');
    this.page = await this.browser.newPage();
  }

 async navigateTo (entrypoint) {
    console.log('navigating to entrypoint', entrypoint);
    await this.page.goto(entrypoint);
  }

  async waitForNavigation () {
    console.log('waiting for navigation');
    await this.page.waitForNavigation();
  }

  async sortResult (cred) {
    console.log('sorting result');
    const url = this.page.url();
    console.log('ended at url', url);
    cred.result_url = url;
    if (cred.should_have_access && cred.entrypoint === url) {
      console.log('succeeded, should have access', cred);
      this.succeeded = cred;
    } else if (!cred.should_have_access && cred.entrypoint !== url) {
      console.log('succeeded, should not have access', cred);
      this.succeeded = cred;
    } else {
      console.error('failed', cred);
      this.failed = cred;
    }
  }
  
  async closePage () {
    console.log('closing page');
    await this.page.close();
  }

  async closeBrowser () {
    console.log('closing browser');
    await this.browser.close();
  }

  async login (cred) {
    // should we store the CSS selector for the login markup in a separate config?
    this.page.waitForSelector("input#Username");
    await this.page.locator("input#Username").fill(cred.username);
    this.page.click("button[type='submit']");
    await this.waitForNavigation();
    console.log(this.page.url());
    this.page.waitForSelector("input#Password");
    await this.page.locator("input#Password").fill(cred.password);
    console.log('clicking submit');
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
