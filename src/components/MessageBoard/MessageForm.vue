<template>
  <div class="message-form">
    <h2 class="form-title">添加留言</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">您的名字：</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          required
          placeholder="请输入您的名字"
        />
      </div>
      <div class="form-group">
        <label for="content">留言内容：</label>
        <textarea
          id="content"
          v-model="formData.content"
          required
          rows="4"
          placeholder="请输入留言内容"
        ></textarea>
      </div>
      <button type="submit" class="submit-button">提交留言</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'MessageForm',
  emits: ['add-message'],
  setup(props, { emit }) {
    const formData = ref({
      name: '',
      content: ''
    })

    const handleSubmit = () => {
      // 在实际项目中，这里会调用API保存数据
      emit('add-message', { ...formData.value })
      
      // 重置表单
      formData.value = {
        name: '',
        content: ''
      }
    }

    return {
      formData,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.message-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-title {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>