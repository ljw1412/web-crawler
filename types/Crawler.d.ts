import Page from './Page';
import { RequestWorker, Callback, Filter, CrawlerOptions, Listener } from './base';
export default class Crawler {
    private _queue;
    private _concurrency;
    private _timeout;
    private _headers;
    private _filter;
    private _callback?;
    private _emitter;
    private _eventTypeCount;
    constructor(options?: CrawlerOptions);
    _initQueue(worker: RequestWorker, concurrency: number): void;
    _getPageCallback(page: Page): Callback;
    _getPageCallbackWrapper(page: Page): Callback;
    on<T extends string | symbol>(event: T, listener: Listener<T>): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    timeout(timeout: number): this;
    callback(callback: Callback): this;
    filter(filter: Filter): this;
    add(page: Page | Page[]): this;
    start(): void;
    pause(): void;
    stop(drain: boolean): any;
}
