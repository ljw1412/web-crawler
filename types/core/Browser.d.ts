import puppeteer, { LaunchOptions } from 'puppeteer';
import Page from '../core/Page';
export default class Browser {
    _browser: puppeteer.Browser;
    _launching: boolean;
    config: LaunchOptions;
    constructor(config?: LaunchOptions);
    init(): Promise<void>;
    getSourceCode(crawlerPage: Page): Promise<string>;
    getPageCount(): Promise<number>;
    destroy(): Promise<void>;
}
