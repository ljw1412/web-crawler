import { Callback, PageOptions, RequsetHeaders } from './base';
import Crawler from './Crawler';
export default class Page {
    crawler: Crawler;
    type: string;
    url: string;
    marker: Record<string, any>;
    tag?: string;
    callback?: Callback;
    timeout?: number;
    headers: RequsetHeaders;
    proxy: string;
    javascript: boolean;
    constructor(options: PageOptions);
}
