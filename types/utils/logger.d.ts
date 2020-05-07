export declare function info(tag: string, ...data: any[]): void;
export declare function warn(tag: string, ...data: any[]): void;
export declare function error(tag: string, ...data: any[]): void;
export declare function success(tag: string, ...data: any[]): void;
declare const _default: {
    info: typeof info;
    warn: typeof warn;
    error: typeof error;
    success: typeof success;
};
export default _default;
