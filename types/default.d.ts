import { Response } from 'superagent';
import { Callback, CallbackData } from './base';
import Page from './Page';
export declare function noop(): void;
export declare function defaultAssignData(data: CallbackData, type: string, resp: Response): void;
export declare const defaultWorker: (assignData?: typeof defaultAssignData) => (page: Page, done: Callback) => Promise<void>;
export declare function undefinedCallback(err: Error | null, { page }: CallbackData): void;
