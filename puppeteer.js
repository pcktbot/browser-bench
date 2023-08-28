const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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
    for (let cred of creds) {
      await this.openBrowser();
      await this.openPage();
      await this.navigateTo(cred.entrypoint);
      await this.login(cred);
      await this.closePage();
      await this.closeBrowser();
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
  
  async closePage () {}

  async closeBrowser () {}

  async login () {}

}

module.exports = Crawler;
