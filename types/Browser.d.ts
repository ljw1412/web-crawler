import puppeteer, { LaunchOptions } from 'puppeteer';
export default class Browser {
    _browser: puppeteer.Browser;
    _launching: boolean;
    config: LaunchOptions;
    constructor(config?: LaunchOptions);
    init(): Promise<void>;
    getSourceCode(url: string): Promise<string>;
    destroy(): Promise<void>;
}
