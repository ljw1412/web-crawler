import Page from './Page';
export default class Crawler {
    private queue;
    private callback?;
    constructor(callback?: WebCrawler.Callback);
    add(page: Page | Page[]): void;
}
