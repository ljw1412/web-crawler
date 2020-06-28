import { CallbackData } from './base';
import Page from './Page';
export declare function noop(): void;
export declare function superagentRequest(page: Page, cbData: CallbackData): Promise<void>;
export declare function undefinedCallback(err: Error | null, { page }: CallbackData): void;
