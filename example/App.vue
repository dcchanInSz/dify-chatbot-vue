<template>
  <div class="container">
    <header>
      <h1>Dify Chatbot Vue 示例</h1>
      <div class="theme-switch">
        <label>
          <input v-model="isDark" type="checkbox" @change="toggleTheme" />
          暗色主题
        </label>
      </div>
    </header>

    <main>
      <div class="chatbot-container">
        <DifyChatbot
          :api-key="apiKey"
          :theme="theme"
          @message="handleMessage"
          @error="handleError"
        />
      </div>

      <div class="config-panel">
        <h2>配置</h2>
        <div class="form-group">
          <label>API Key:</label>
          <input v-model="apiKey" type="text" placeholder="输入您的 Dify API Key" />
        </div>
      </div>

      <div class="message-log">
        <h2>消息日志</h2>
        <div class="log-content">
          <pre>{{ JSON.stringify(messages, null, 2) }}</pre>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DifyChatbot } from '../src/lib'
import type { ChatMessage } from '../src/lib/types'

const apiKey = ref('')
const isDark = ref(false)
const theme = computed(() => (isDark.value ? 'dark' : 'light'))
const messages = ref<ChatMessage[]>([])

const handleMessage = (message: ChatMessage) => {
  messages.value.push(message)
}

const handleError = (error: Error) => {
  console.error('Chatbot error:', error)
}

const toggleTheme = () => {
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chatbot-container {
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.config-panel {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin: 1rem 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.message-log {
  margin-top: 2rem;
}

.log-content {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
}

/* 暗色主题样式 */
:root.dark {
  background-color: #242424;
  color: rgba(255, 255, 255, 0.87);
}

:root.dark .config-panel,
:root.dark .chatbot-container {
  border-color: #333;
}

:root.dark .log-content {
  background: #333;
}

:root.dark input {
  background: #333;
  border-color: #444;
  color: rgba(255, 255, 255, 0.87);
}
</style>
