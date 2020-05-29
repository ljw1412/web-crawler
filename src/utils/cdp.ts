import WebSocket from 'ws'

export const cdp = {
  async _send(ws: WebSocket, command: Record<string, any>): Promise<any> {
    ws.send(JSON.stringify(command))
    return new Promise(resolve => {
      ws.on('message', function handler(msg: string) {
        const response = JSON.parse(msg)
        if (response.id === command.id) {
          ws.removeListener('message', handler)
          resolve(response)
        }
      })
    })
  },
  Target: {
    async attachToTarget(ws: WebSocket, targetId: string) {
      const result = (
        await cdp._send(ws, {
          id: 1,
          method: 'Target.attachToTarget',
          params: {
            targetId: targetId,
            flatten: true
          }
        })
      ).result
      return result ? result.sessionId : undefined
    }
  },
  Network: {
    async getCookies(ws: WebSocket, sessionId: string) {
      const result = (
        await cdp._send(ws, {
          sessionId,
          id: 2,
          method: 'Network.getCookies'
        })
      ).result
      return result ? result.cookies : undefined
    }
  }
}

export default cdp
