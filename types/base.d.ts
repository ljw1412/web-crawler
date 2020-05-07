/// <reference types="cheerio" />
import fastq from 'fastq';
import Page from './Page';
import Crawler from './Crawler';
export interface CallbackData {
    raw: string;
    page: Page;
    $?: CheerioSelector;
    json?: Record<string, any> | null;
    [key: string]: any;
}
export declare type Callback = (err: Error | null, data: CallbackData) => void;
export declare type Filter = (page: Page) => boolean;
export declare type Queue = fastq.queue;
export declare type RequestWorker = fastq.worker<Crawler>;
interface BaseOptions {
    timeout?: number;
    callback?: Callback;
}
export interface CrawlerOptions extends BaseOptions {
    concurrency?: number;
    worker?: RequestWorker;
}
export interface PageOptions extends BaseOptions {
    type: string;
    url: string;
    tag?: string;
    marker?: Record<string, any>;
}
export declare const version: string;
export {};
