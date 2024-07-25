import PuppeteerCodeGenerator from '@/modules/code-generator/puppeteer'
import PlaywrightCodeGenerator from '@/modules/code-generator/playwright'
import BaseGenerator from '@/modules/code-generator/base-generator'

export default class CodeGenerator {
  constructor(options = {}) {
    this.baseGenerator = new BaseGenerator(options)
    this.puppeteerGenerator = new PuppeteerCodeGenerator(options)
    this.playwrightGenerator = new PlaywrightCodeGenerator(options)
  }

  generate(recording) {
    return {
      base: this.baseGenerator.generates(recording),
      puppeteer: this.puppeteerGenerator.generate(recording),
      playwright: this.playwrightGenerator.generate(recording),
    }
  }
}
