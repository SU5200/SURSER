<template>
  <div class="message-list">
    <h3 class="list-title">留言笔记本：</h3>
    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">💬</div>
      <p class="empty-text">暂无留言，快来发布第一条留言吧！</p>
    </div>
    <div v-else class="messages">
      <div 
        v-for="message in sortedMessages" 
        :key="message.id"
        class="message-item notebook-line"
      >
        <div class="message-inner">
          <div class="message-header">
            <span class="message-username">{{ message.username }}</span>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-content">
            {{ message.content }}
          </div>
          <div class="message-actions">
            <button 
              class="delete-btn"
              @click="handleDelete(message.id)"
              title="删除留言"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['message-deleted'])

// 按时间倒序排序留言
const sortedMessages = computed(() => {
  return [...props.messages].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp)
  })
})

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`
  }
  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  }
  // 小于7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  }
  
  // 超过7天显示具体日期
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 处理删除留言
const handleDelete = (messageId) => {
  if (confirm('确定要删除这条留言吗？')) {
    emit('message-deleted', messageId)
  }
}
</script>

<style scoped>
.message-list {
  background-color: transparent;
  border-radius: 8px;
  margin-top: 10px;
  position: relative;
}

.list-title {
  color: #34495e;
  margin-bottom: 12px;
  font-size: 1.2rem;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #95a5a6;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.1rem;
  margin: 0;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.message-item {
  position: relative;
}

.notebook-line {
  padding-left: 42px;
}

.message-inner {
  background-color: transparent;
  padding: 8px 8px 6px 0;
  min-height: 28px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-username {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.message-time {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.message-content {
  color: #34495e;
  line-height: 1.5;
  word-wrap: break-word;
  margin-bottom: 8px;
  font-family: 'KaiTi', 'STKaiti', 'DFKai-SB', 'Comic Sans MS', cursive;
  font-size: 1rem;
}

.message-actions {
  text-align: right;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1;
  background-color: rgba(231, 76, 60, 0.1);
}

@media (max-width: 768px) {
  .message-item {
    padding: 12px;
  }
  
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .empty-state {
    padding: 40px 15px;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
}
</style>