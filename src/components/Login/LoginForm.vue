<template>
  <div class="login-container">
    <div class="login-form">
      <h1 class="login-title">欢迎来到我们的互动留言板</h1>
      <p class="login-subtitle">请输入您的姓名开始探索</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">您的姓名：</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="请输入您的姓名"
            maxlength="20"
          />
        </div>
        <button type="submit" class="login-button">进入留言板</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user.js'

const router = useRouter()
const userStore = useUserStore()
const username = ref('')

const handleSubmit = () => {
  if (username.value.trim()) {
    // 保存用户信息到store
    userStore.setUsername(username.value.trim())
    // 跳转到话题选择页面
    router.push('/topics')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f4f8;
  padding: 20px;
}

.login-form {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-title {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 2rem;
}

.login-subtitle {
  color: #7f8c8d;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

.login-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.login-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .login-form {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 1.7rem;
  }
}
</style>