import { Response } from 'superagent';
import { Callback, CallbackData } from './base';
import Page from './Page';
export declare const config: {
    timeout: number;
    'User-Agent': string;
};
export declare function noop(): void;
export declare function assignData(data: CallbackData, type: string, resp: Response): void;
export declare const defaultWorker: (page: Page, done: Callback) => Promise<void>;
export declare function undefinedCallback(err: Error | null, { page }: CallbackData): void;
