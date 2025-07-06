<template>
  <div class="dify-chatbot" :class="{ dark: props.theme === 'dark' }">
    <!-- Chatbot UI will be implemented here -->
    <div class="dify-chatbot-messages">
      <!-- Messages will be rendered here -->
    </div>
    <div class="dify-chatbot-input">
      <!-- Input area will be implemented here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { ChatbotProps } from '../types'

const props = defineProps<ChatbotProps>()
</script>

<style scoped>
.dify-chatbot {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
}

.dify-chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.dify-chatbot-input {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
}
</style>
