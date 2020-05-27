import Page from './Page';
import Browser from './Browser';
import { superagentRequest } from './default';
import { Callback, Filter, CrawlerOptions, Listener, PageOptions } from './base';
export default class Crawler {
    private _queue;
    private _concurrency;
    private _timeout;
    private _headers;
    private _proxy;
    private _filter;
    private _callback?;
    private _emitter;
    private _eventTypeCount;
    private _readyExitTimer;
    private _pageId;
    browser: Browser;
    default: {
        timeout: number;
        request: typeof superagentRequest;
        'User-Agent': string;
    };
    constructor(options?: CrawlerOptions);
    _updateReadyExitTimer(): void;
    _worker(page: Page, done: Callback): Promise<void>;
    _initQueue(concurrency: number): void;
    _getPageCallback(page: Page): Callback;
    _getPageCallbackWrapper(page: Page): Callback;
    on<T extends string | symbol>(event: T, listener: Listener<T>): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    timeout(timeout: number): this;
    callback(callback: Callback): this;
    filter(filter: Filter): this;
    add(page: Page | Page[]): this;
    addPage(page: PageOptions | PageOptions[]): this;
    start(): void;
    pause(): void;
    stop(): any;
}
