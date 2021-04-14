import { Callback, PageOptions, RequsetHeaders } from './base';
import Emitter from '../utils/emitter';
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
    emitter: Emitter;
    method: 'GET' | 'POST';
    query?: string | object;
    data?: string | object;
    constructor(options: PageOptions);
}
