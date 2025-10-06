import { EventEmitter } from 'events';
import Page from '../core/Page';
export type EvnetLevel = 'error' | 'warn' | 'info' | 'success';
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
    errorLog: (this: LooseEventEmitter, tag: string, message: string, store?: EventStore) => void;
    warnLog: (this: LooseEventEmitter, tag: string, message: string, store?: EventStore) => void;
    infoLog: (this: LooseEventEmitter, tag: string, message: string, store?: EventStore) => void;
    successLog: (this: LooseEventEmitter, tag: string, message: string, store?: EventStore) => void;
}
export type LooseEventEmitter = Emitter & {
    emit(event: string | symbol, ...args: any[]): boolean;
};
