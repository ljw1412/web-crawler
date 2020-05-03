import fastq from 'fastq';
import Page from './Page';
interface CrawlerOptions {
    concurrency: number;
    worker?: fastq.worker<Crawler>;
    callback?: WebCrawler.Callback;
}
export default class Crawler {
    private queue;
    private callbackFn?;
    private filterFn;
    constructor(options?: CrawlerOptions);
    get size(): () => number;
    get isEmpty(): boolean;
    callback(callback: WebCrawler.Callback): this;
    filter(filter: WebCrawler.Filter): this;
    getPageCallback(page: Page): WebCrawler.Callback;
    add(page: Page | Page[]): this;
    start(): void;
    pause(): void;
    stop(drain: boolean): any;
}
export {};
