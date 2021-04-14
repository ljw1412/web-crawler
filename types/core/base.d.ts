/// <reference types="cheerio" />
/// <reference types="node" />
import fastq from 'fastq';
import CookieJar from 'cookiejar';
import Page from './Page';
export interface CallbackData {
    raw: string;
    page: Page;
    $?: CheerioSelector;
    json?: Record<string, any> | null;
    buffer?: Buffer;
    cookie?: ReadonlyArray<CookieJar.Cookie> & {
        toValueString(): string;
    };
    [key: string]: any;
}
export declare type Callback = (err: Error | null, data: CallbackData) => void;
export declare type Filter = (page: Page) => boolean;
export declare type Queue = fastq.queue;
export declare type Listener<T> = T extends 'error' ? (error: Error, data: CallbackData) => void : (data: CallbackData) => void;
export interface RequsetHeaders {
    Referer?: string;
    Cookie?: string;
    Origin?: string;
    'User-Agent'?: string;
    [k: string]: any;
}
export interface CrawlerDefaultOptions {
    timeout: number;
    request: (page: Page, data: CallbackData) => Promise<void>;
    'User-Agent': string;
    [k: string]: any;
}
interface BaseOptions {
    timeout?: number;
    proxy?: string;
    headers?: RequsetHeaders;
    callback?: Callback;
}
export interface CrawlerOptions extends BaseOptions {
    hideDefaultLog?: boolean;
    concurrency?: number;
    end?: Function;
}
export interface PageOptions extends BaseOptions {
    type: 'html' | 'image' | 'file' | 'json' | string;
    url: string;
    tag?: string;
    marker?: Record<string, any>;
    method?: 'GET' | 'POST';
    query?: string | object;
    data?: string | object;
}
export declare const version: string;
export {};
