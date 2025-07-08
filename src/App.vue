<script setup lang="ts">
import DifyChatbot from './lib/components/DifyChatbot.vue'
</script>

<template>
  <div class="app-container">
    <DifyChatbot
      api-key="app-G6JurwW9LyzeFpFcGT4PzEbq"
      api-endpoint="http://dify.langcode.tech/v1"
      theme="light"
      placeholder="请输入您的问题..."
    />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.dify-chatbot {
  width: 100%;
  max-width: 800px;
  height: 600px;
}
</style>
