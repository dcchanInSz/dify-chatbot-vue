<template>
  <div class="dify-chatbot" :class="{ dark: props.theme === 'dark' }">
    <div ref="messagesRef" class="dify-chatbot-messages">
      <div v-for="message in messages" :key="message.id" class="message" :class="message.role">
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>
    <div class="dify-chatbot-input">
      <textarea
        ref="textareaRef"
        v-model="userInput"
        :placeholder="props.placeholder || '请输入您的问题...'"
        rows="1"
        @keydown.enter.prevent="handleSend"
      ></textarea>
      <button :disabled="isLoading || !userInput.trim()" @click="handleSend">
        <span v-if="isLoading">发送中...</span>
        <span v-else>发送</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, nextTick } from 'vue'
import type { ChatbotProps, ChatMessage, DifyRequestBody, DifyStreamChunk } from '../types'

const props = defineProps<ChatbotProps>()
const messages = ref<ChatMessage[]>([])
const userInput = ref('')
const isLoading = ref(false)
const conversationId = ref<string | undefined>()
const currentMessageId = ref<string | undefined>()
const messagesRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

const processStreamResponse = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
  const decoder = new TextDecoder()
  let currentMessage = ''

  try {
    let done = false
    while (!done) {
      const result = await reader.read()
      done = result.done
      if (done) break

      const chunk = decoder.decode(result.value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data: ')) continue

        const jsonStr = line.replace('data: ', '')
        try {
          const data = JSON.parse(jsonStr) as DifyStreamChunk

          switch (data.event) {
            case 'message':
              if (data.answer) {
                currentMessage += data.answer
                // 更新或创建消息
                if (!currentMessageId.value) {
                  currentMessageId.value = data.message_id
                  messages.value.push({
                    id: currentMessageId.value!,
                    role: 'assistant',
                    content: currentMessage,
                    timestamp: Date.now(),
                  })
                } else {
                  const messageIndex = messages.value.findIndex(
                    m => m.id === currentMessageId.value
                  )
                  if (messageIndex !== -1) {
                    messages.value[messageIndex].content = currentMessage
                  }
                }
                await scrollToBottom()
              }
              if (data.conversation_id) {
                conversationId.value = data.conversation_id
              }
              break

            case 'error':
              console.error('Stream error:', data.error)
              messages.value.push({
                id: Date.now().toString(),
                role: 'assistant',
                content: '抱歉，发生了错误，请稍后重试。',
                timestamp: Date.now(),
              })
              break

            case 'done':
              currentMessageId.value = undefined
              break
          }
        } catch (e) {
          console.error('Error parsing stream data:', e)
        }
      }
    }
  } catch (error) {
    console.error('Error reading stream:', error)
    messages.value.push({
      id: Date.now().toString(),
      role: 'assistant',
      content: '抱歉，读取响应时发生错误。',
      timestamp: Date.now(),
    })
  }
}

const handleSend = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: userInput.value,
    timestamp: Date.now(),
  }
  messages.value.push(userMessage)
  const query = userInput.value
  userInput.value = ''
  await scrollToBottom()

  try {
    isLoading.value = true
    const endpoint = props.apiEndpoint || 'https://api.dify.ai/v1'
    const response = await fetch(`${endpoint}/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${props.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        conversation_id: conversationId.value,
        response_mode: 'streaming',
        user: 'user1',
        inputs: {},
        files: [],
      } as DifyRequestBody),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (reader) {
      await processStreamResponse(reader)
    } else {
      throw new Error('No response body')
    }
  } catch (error) {
    console.error('Error sending message:', error)
    messages.value.push({
      id: Date.now().toString(),
      role: 'assistant',
      content: '抱歉，发生了错误，请稍后重试。',
      timestamp: Date.now(),
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.addEventListener('input', () => {
      const textarea = textareaRef.value
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = textarea.scrollHeight + 'px'
      }
    })
  }
})
</script>

<style scoped>
textarea {
  color: #333;
}

.dify-chatbot {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.dify-chatbot.dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.dify-chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 80%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.message.user {
  align-self: flex-end;
  background-color: #007aff;
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background-color: #f0f0f0;
  color: #333;
}

.dark .message.assistant {
  background-color: #2a2a2a;
  color: #ffffff;
}

.dify-chatbot-input {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
}

.dark .dify-chatbot-input {
  border-top-color: rgba(255, 255, 255, 0.1);
}

textarea {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  min-height: 20px;
  max-height: 120px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  background-color: transparent;
}

.dark textarea {
  border-color: #444;
  color: #ffffff;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.dark button:disabled {
  background-color: #444;
}
</style>
