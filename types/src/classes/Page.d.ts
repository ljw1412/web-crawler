interface PageOptions {
    type: string;
    url: string;
    marker?: Record<string, any>;
    timeout?: number;
    callback?: WebCrawler.Callback;
}
export default class Page {
    type: string;
    url: string;
    marker: Record<string, any>;
    callback?: WebCrawler.Callback;
    timeout?: number;
    constructor(options: PageOptions);
}
export {};
