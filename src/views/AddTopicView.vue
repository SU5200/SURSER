<template>
  <div class="add-topic-view">
    <div class="container">
      <div class="header">
        <h1 class="page-title">添加新话题</h1>
        <button class="back-btn" @click="goBack">返回话题列表</button>
      </div>
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="topicName">话题名称：</label>
            <input
              type="text"
              id="topicName"
              v-model="topicForm.name"
              required
              placeholder="请输入话题名称"
              maxlength="10"
            />
          </div>
          <div class="form-group">
            <label for="topicColor">话题颜色：</label>
            <input
              type="color"
              id="topicColor"
              v-model="topicForm.color"
              required
            />
          </div>
          <div class="form-group">
            <label for="topicIcon">选择图标：</label>
            <div class="icon-selector">
              <button 
                v-for="icon in availableIcons" 
                :key="icon"
                type="button"
                class="icon-btn"
                :class="{ active: topicForm.icon === icon }"
                @click="topicForm.icon = icon"
              >
                {{ icon }}
              </button>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-btn">创建话题</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTopicStore } from '../store/topics.js'

const router = useRouter()
const topicStore = useTopicStore()

const topicForm = reactive({
  name: '',
  color: '#3498DB',
  icon: '🌟'
})

const availableIcons = [
  '🎮', '💡', '⏸️', '🏆', '😴', '💭', '👨‍🏫', '🌌', '🎭',
  '🎨', '🎵', '📚', '🎯', '🎪', '🎭', '🔮', '🌈', '⭐',
  '🔥', '💧', '🌿', '⚡', '💎', '🦋', '🌺', '🌙', '☀️'
]

const handleSubmit = () => {
  if (topicForm.name.trim()) {
    // 添加新话题
    topicStore.addTopic({
      name: topicForm.name.trim(),
      color: topicForm.color,
      icon: topicForm.icon
    })
    // 返回话题列表
    router.push('/topics')
  }
}

const goBack = () => {
  router.push('/topics')
}
</script>

<style scoped>
.add-topic-view {
  min-height: 100vh;
  background-color: #f0f4f8;
  padding: 30px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
}

.back-btn {
  background-color: #7f8c8d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #95a5a6;
}

.form-container {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-weight: 500;
  font-size: 1.1rem;
}

input[type="text"] {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

input[type="color"] {
  width: 80px;
  height: 50px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  cursor: pointer;
  padding: 5px;
}

.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
}

.icon-btn {
  background-color: #f8f9fa;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background-color: #e9ecef;
  border-color: #3498db;
}

.icon-btn.active {
  background-color: #3498db;
  border-color: #2980b9;
  color: white;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}

.submit-btn {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background-color: #219a52;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

@media (max-width: 768px) {
  .add-topic-view {
    padding: 20px;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .icon-selector {
    max-height: 150px;
  }
}
</style>