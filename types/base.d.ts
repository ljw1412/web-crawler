/// <reference types="cheerio" />
/// <reference types="node" />
import fastq from 'fastq';
import Page from './Page';
import Crawler from './Crawler';
export interface CallbackData {
    raw: string;
    page: Page;
    $?: CheerioSelector;
    json?: Record<string, any> | null;
    buffer?: Buffer;
    [key: string]: any;
}
export declare type Callback = (err: Error | null, data: CallbackData) => void;
export declare type Filter = (page: Page) => boolean;
export declare type Queue = fastq.queue;
export declare type RequestWorker = fastq.worker<Crawler>;
export declare type Listener<T> = T extends 'error' ? (error: Error, data: CallbackData) => void : (data: CallbackData) => void;
export interface RequsetHeaders {
    Referer?: string;
    Cookie?: string;
    Origin?: string;
    'User-Agent'?: string;
    [k: string]: any;
}
interface BaseOptions {
    timeout?: number;
    headers?: RequsetHeaders;
    callback?: Callback;
}
export interface CrawlerOptions extends BaseOptions {
    concurrency?: number;
    worker?: RequestWorker;
}
export interface PageOptions extends BaseOptions {
    type: 'html' | 'image' | 'json' | string;
    url: string;
    tag?: string;
    marker?: Record<string, any>;
}
export declare const version: string;
export {};
