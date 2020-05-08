import { Callback, PageOptions, RequsetHeaders } from './base';
export default class Page {
    type: string;
    url: string;
    marker: Record<string, any>;
    tag?: string;
    callback?: Callback;
    timeout?: number;
    headers: RequsetHeaders;
    constructor(options: PageOptions);
}
