<template>
  <div class="message-board-container">
    <h1 class="message-board-title">留言板</h1>
    <MessageForm @add-message="handleAddMessage" />
    <MessageList 
      :messages="messages" 
      @delete-message="handleDeleteMessage"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import MessageForm from './MessageForm.vue'
import MessageList from './MessageList.vue'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'MessageBoard',
  components: {
    MessageForm,
    MessageList
  },
  setup() {
    const messages = ref([])

    // 模拟数据
    const mockMessages = [
      {
        id: uuidv4(),
        name: '张三',
        content: '这是第一条留言！',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: uuidv4(),
        name: '李四',
        content: '留言板功能真不错！',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ]

    onMounted(() => {
      // 在实际项目中，这里会从API获取数据
      // 现在使用模拟数据
      messages.value = mockMessages
    })

    const handleAddMessage = (message) => {
      const newMessage = {
        id: uuidv4(),
        ...message,
        timestamp: new Date().toISOString()
      }
      messages.value.unshift(newMessage)
    }

    const handleDeleteMessage = (id) => {
      messages.value = messages.value.filter(msg => msg.id !== id)
    }

    return {
      messages,
      handleAddMessage,
      handleDeleteMessage
    }
  }
}
</script>

<style scoped>
.message-board-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.message-board-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}
</style>