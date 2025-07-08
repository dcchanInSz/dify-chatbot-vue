export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatbotProps {
  apiKey: string
  apiEndpoint?: string
  theme?: 'light' | 'dark'
  placeholder?: string
}

export interface DifyResponse {
  answer: string
  conversation_id: string
  message_id: string
}

export interface DifyError {
  error: {
    message: string
    type: string
  }
}

export interface DifyRequestBody {
  inputs?: Record<string, string>
  query: string
  conversation_id?: string
  response_mode?: 'streaming' | 'blocking'
  user?: string
  files?: never[] // 由于目前不支持文件上传，我们将其设置为空数组类型
}

export interface DifyStreamChunk {
  event: 'message' | 'error' | 'done'
  task_id?: string
  id?: string
  answer?: string
  conversation_id?: string
  message_id?: string
  created_at?: number
  error?: {
    message: string
    type: string
  }
}
