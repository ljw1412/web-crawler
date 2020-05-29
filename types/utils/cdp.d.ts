import WebSocket from 'ws';
export declare const cdp: {
    _send(ws: WebSocket, command: Record<string, any>): Promise<any>;
    Target: {
        attachToTarget(ws: WebSocket, targetId: string): Promise<any>;
    };
    Network: {
        getCookies(ws: WebSocket, sessionId: string): Promise<any>;
    };
};
export default cdp;
