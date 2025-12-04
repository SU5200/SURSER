<template>
  <div class="message-list">
    <h2 class="list-title">留言列表</h2>
    <div v-if="messages.length === 0" class="empty-message">
      暂无留言，快来添加第一条留言吧！
    </div>
    <div 
      v-for="message in messages" 
      :key="message.id" 
      class="message-item"
    >
      <div class="message-header">
        <span class="message-author">{{ message.name }}</span>
        <span class="message-time">{{ formatTime(message.timestamp) }}</span>
      </div>
      <div class="message-content">{{ message.content }}</div>
      <div class="message-actions">
        <button 
          class="delete-button" 
          @click="handleDelete(message.id)"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageList',
  props: {
    messages: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['delete-message'],
  setup(props, { emit }) {
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      // 小于1分钟
      if (diff < 60000) {
        return '刚刚'
      }
      
      // 小于1小时
      if (diff < 3600000) {
        return Math.floor(diff / 60000) + '分钟前'
      }
      
      // 小于24小时
      if (diff < 86400000) {
        return Math.floor(diff / 3600000) + '小时前'
      }
      
      // 小于30天
      if (diff < 2592000000) {
        return Math.floor(diff / 86400000) + '天前'
      }
      
      // 显示具体日期
      return date.toLocaleDateString('zh-CN')
    }

    const handleDelete = (id) => {
      if (confirm('确定要删除这条留言吗？')) {
        // 在实际项目中，这里会调用API删除数据
        emit('delete-message', id)
      }
    }

    return {
      formatTime,
      handleDelete
    }
  }
}
</script>

<style scoped>
.message-list {
  margin-top: 20px;
}

.list-title {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.message-item {
  background-color: white;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.message-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.message-author {
  font-weight: 600;
  color: #333;
}

.message-time {
  color: #999;
  font-size: 0.85rem;
}

.message-content {
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
  word-break: break-word;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
}

.delete-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #da190b;
}
</style>