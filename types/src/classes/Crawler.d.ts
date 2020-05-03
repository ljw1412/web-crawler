import Page from './Page';
export default class Crawler {
    private queue;
    private callbackFn?;
    private filterFn;
    constructor(callback?: WebCrawler.Callback);
    get size(): number;
    get isEmpty(): boolean;
    injectCallbackToPage(page: Page): void;
    callback(callback: WebCrawler.Callback): this;
    filter(filter: WebCrawler.Filter): this;
    add(page: Page | Page[]): this;
    start(): void;
    stop(): void;
}
