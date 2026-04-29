import app from '@adonisjs/core/services/app'
import { IncomingMessage } from 'node:http'
import { WebSocketServer, WebSocket } from 'ws'

type SerializedLocation = {
  id: string
  latitude: number
  longitude: number
  accuracy: number | null
  timestamp: string | null
  country: string | null
  state: string | null
  description: string | null
  createdAt: string | null
}

let websocketServer: WebSocketServer | null = null
const connectedClients = new Set<WebSocket>()

function parseAllowedOrigins() {
  const configuredOrigins = process.env.WS_ALLOWED_ORIGINS ?? ''
  if (!configuredOrigins) {
    return app.inDev ? ['*'] : []
  }

  return configuredOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function isOriginAllowed(requestOrigin: string | undefined, allowedOrigins: string[]) {
  if (allowedOrigins.includes('*')) {
    return true
  }

  if (!requestOrigin) {
    return false
  }

  return allowedOrigins.includes(requestOrigin)
}

export function startLocationBroadcastServer() {
  if (websocketServer) {
    return websocketServer
  }

  const wsPort = Number.parseInt(process.env.WS_PORT ?? '5001', 10)
  const wsHost = process.env.WS_HOST ?? '0.0.0.0'
  const allowedOrigins = parseAllowedOrigins()

  websocketServer = new WebSocketServer({ host: wsHost, port: wsPort })

  websocketServer.on('connection', (socket: WebSocket, request: IncomingMessage) => {
    if (!isOriginAllowed(request.headers.origin, allowedOrigins)) {
      socket.close(1008, 'Origin not allowed')
      return
    }

    connectedClients.add(socket)

    socket.on('close', () => {
      connectedClients.delete(socket)
    })
  })

  websocketServer.on('listening', () => {
    console.log(`Location WS server listening on ws://${wsHost}:${wsPort}`)
  })

  websocketServer.on('error', (error: Error) => {
    console.error('Location WS server error:', error)
  })

  return websocketServer
}

export function stopLocationBroadcastServer() {
  if (!websocketServer) {
    return
  }

  for (const client of connectedClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.close()
    }
  }

  connectedClients.clear()
  websocketServer.close()
  websocketServer = null
}

export function broadcastLocationCreated(location: SerializedLocation) {
  const payload = JSON.stringify({
    event: 'location:created',
    type: 'location:created',
    data: location,
  })

  for (const client of connectedClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload)
    }
  }
}
