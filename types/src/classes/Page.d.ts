interface PageOptions {
    type: string;
    url: string;
    callback?: WebCrawler.Callback;
}
export default class Page {
    type: string;
    url: string;
    callback?: WebCrawler.Callback;
    constructor(options: PageOptions);
}
export {};
