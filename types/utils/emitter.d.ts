/// <reference types="node" />
import { EventEmitter } from 'events';
import Page from '../core/Page';
export declare type EvnetLevel = 'error' | 'warn' | 'info' | 'success';
export interface EventStore {
    error?: Error | null;
    page: Page;
    [k: string]: any;
}
export declare class Event {
    time: Date;
    level: EvnetLevel;
    tag: string;
    tagName: string;
    message: string;
    store?: EventStore;
    constructor();
    set(tag: string, message: string, store?: EventStore): this;
    static createEvent(level: EvnetLevel): Event;
}
export default class Emitter extends EventEmitter {
    printConsole: boolean;
    get _eventTypeCount(): number;
    get hasErrorListener(): boolean;
    errorLog: (this: Emitter, tag: string, message: string, store?: EventStore | undefined) => void;
    warnLog: (this: Emitter, tag: string, message: string, store?: EventStore | undefined) => void;
    infoLog: (this: Emitter, tag: string, message: string, store?: EventStore | undefined) => void;
    successLog: (this: Emitter, tag: string, message: string, store?: EventStore | undefined) => void;
}
