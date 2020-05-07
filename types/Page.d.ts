import { Callback, PageOptions } from './base';
export default class Page {
    type: string;
    url: string;
    marker: Record<string, any>;
    tag?: string;
    callback?: Callback;
    timeout?: number;
    constructor(options: PageOptions);
}
