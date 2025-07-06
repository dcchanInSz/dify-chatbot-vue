# Dify Chatbot Vue

一个基于 Vue 3 的 Dify AI 聊天机器人组件。

## 特性

- 🚀 基于 Vue 3 和 TypeScript 开发
- 💪 完整的类型支持
- 🎨 支持亮色/暗色主题
- 📦 支持 ESM 和 UMD 格式
- 🔧 高度可定制的界面和行为

## 安装

```bash
# npm
npm install dify-chatbot-vue

# yarn
yarn add dify-chatbot-vue

# pnpm
pnpm add dify-chatbot-vue
```

## 快速开始

```vue
<template>
  <DifyChatbot api-key="your-api-key" theme="light" />
</template>

<script setup lang="ts">
import { DifyChatbot } from 'dify-chatbot-vue'
import 'dify-chatbot-vue/dist/style.css'
</script>
```

## API

### Props

| 属性        | 类型              | 默认值          | 描述                  |
| ----------- | ----------------- | --------------- | --------------------- |
| apiKey      | string            | -               | Dify API 密钥（必填） |
| apiEndpoint | string            | -               | 自定义 API 端点       |
| theme       | 'light' \| 'dark' | 'light'         | 主题设置              |
| placeholder | string            | '请输入消息...' | 输入框占位文本        |

### 事件

| 事件名  | 参数        | 描述                 |
| ------- | ----------- | -------------------- |
| message | ChatMessage | 发送或接收消息时触发 |
| error   | Error       | 发生错误时触发       |

### 插槽

| 插槽名  | 参数                     | 描述           |
| ------- | ------------------------ | -------------- |
| message | { message: ChatMessage } | 自定义消息渲染 |
| input   | -                        | 自定义输入框   |

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建库
pnpm build:lib

# 预览示例
pnpm preview
```

## License

MIT
