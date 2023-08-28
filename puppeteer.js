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
    this._suceeded = [];
    this._failed = [];
  }

  get suceeded () { return this._suceeded; }
  set suceeded (value) { this._suceeded.push(value); }
  get failed () { return this._failed; }
  set failed (value) { this._failed.push(value); }

  async run (creds) {
    for (const cred of creds) {
      await this.openBrowser(this.config);
      await this.openPage();
      // await this.navigateTo(cred.entrypoint);
      // await this.login(cred);
      // await this.waitForNavigation();
      // await this.sortResult();
      await this.closePage();
      await this.closeBrowser();
      // this.surfaceResults();
      return "finished"
    }
  }

  async openBrowser () {
    console.log('opening browser');
    this.browser = await puppeteer.launch({ headless: false });
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

  async sortResult () {}
  
  async closePage () {
    console.log('closing page');
    await this.page.close();
  }

  async closeBrowser () {
    console.log('closing browser');
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
