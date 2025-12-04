<template>
  <div class="message-form">
    <h3 class="form-title">写下你的留言：</h3>
    
    <!-- 姓名输入框 - 在选择话题后显示 -->
    <div class="username-input-container">
      <label for="username">您的称呼：</label>
      <input
        id="username"
        v-model="username"
        type="text"
        placeholder="请输入您的称呼"
        maxlength="20"
        class="username-input"
        autocomplete="off"
      />
    </div>
    
    <div v-if="!username.trim()" class="no-username-warning">
      请先输入您的称呼才能发表留言
    </div>
    
    <form @submit.prevent="handleSubmit">
      <textarea
        v-model="messageContent"
        placeholder="请输入你的留言..."
        rows="4"
        required
        maxlength="500"
      ></textarea>
      <div class="form-footer">
        <span class="char-count" :class="{ warning: messageContent.length > 450 }">
          {{ messageContent.length }}/500
        </span>
        <button type="submit" class="submit-btn" :disabled="!messageContent.trim() || !username.trim()">
          发送留言
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTopicStore } from '../store/topics.js'

const props = defineProps({
  topicId: {
    type: String,
    required: true
  }
  // 移除username prop，改为组件内部管理
})

const emit = defineEmits(['message-added'])

const messageContent = ref('')
const username = ref('') // 在组件内部管理用户名
const topicStore = useTopicStore()

const handleSubmit = () => {
  // 调试输出
  console.log('提交留言:', { content: messageContent.value, username: username.value })
  
  // 验证留言内容
  if (!messageContent.value.trim()) {
    console.log('留言内容为空')
    return
  }
  
  // 验证用户名
  const trimmedUsername = username.value.trim()
  if (!trimmedUsername) {
    console.log('用户名为空字符串')
    return
  }
  
  // 创建新留言
  const newMessage = {
    id: Date.now().toString(),
    content: messageContent.value.trim(),
    username: trimmedUsername
  }
  
  // 添加到话题
  topicStore.addMessage(props.topicId, newMessage)
  console.log('留言添加成功:', newMessage)
  
  // 清空留言输入框，但保留用户名以便继续留言
  messageContent.value = ''
  
  // 触发事件
  emit('message-added')
}
</script>

<style scoped>
.message-form {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-title {
  color: #34495e;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

textarea:focus {
  outline: none;
  border-color: #3498db;
}

textarea::placeholder {
  color: #95a5a6;
}

.username-input-container {
  margin-bottom: 15px;
}

.username-input-container label {
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-weight: 500;
  font-size: 0.95rem;
}

.username-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.username-input:focus {
  outline: none;
  border-color: #3498db;
}

.username-input::placeholder {
  color: #95a5a6;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.char-count {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.char-count.warning {
  color: #e74c3c;
  font-weight: 600;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.no-username-warning {
  background-color: #fff3cd;
  color: #856404;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 0.95rem;
  border: 1px solid #ffeaa7;
}

@media (max-width: 768px) {
  .message-form {
    padding: 15px;
  }
  
  .form-footer {
    flex-direction: column-reverse;
    gap: 10px;
    align-items: stretch;
  }
  
  .submit-btn {
    width: 100%;
  }
}
</style>