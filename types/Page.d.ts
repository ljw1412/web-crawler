import { Callback, PageOptions, RequsetHeaders } from './base';
export default class Page {
    id: number;
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
