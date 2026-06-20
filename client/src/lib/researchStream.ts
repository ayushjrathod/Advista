import type { Report } from '../types/chat'

export interface ResearchStreamHandlers {
  onProgress: (message: string) => void
  onReport: (report: Report) => void
  onError: (error: string) => void
}

/**
 * POSTs to the research endpoint and consumes its Server-Sent Events stream,
 * dispatching `progress`, `report`, and `error` events to the given handlers.
 * The backend emits frames as `event: <name>\ndata: <payload>\n\n`.
 */
export async function streamResearch(sessionId: string, handlers: ResearchStreamHandlers): Promise<void> {
  try {
    const res = await fetch('/api/research/start-research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
    if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // SSE frames are separated by a blank line.
      const frames = buffer.split('\n\n')
      buffer = frames.pop() ?? ''

      for (const frame of frames) {
        if (!frame.trim()) continue
        let event = 'message'
        let data = ''
        for (const line of frame.split('\n')) {
          if (line.startsWith('event:')) event = line.slice(6).trim()
          else if (line.startsWith('data:')) data += line.slice(5).replace(/^ /, '')
        }
        if (event === 'progress') handlers.onProgress(data)
        else if (event === 'report') handlers.onReport(JSON.parse(data) as Report)
        else if (event === 'error') handlers.onError(data)
      }
    }
  } catch (err) {
    handlers.onError(err instanceof Error ? err.message : 'Research failed')
  }
}
