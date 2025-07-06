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
