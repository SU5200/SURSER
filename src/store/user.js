import { ref, reactive } from 'vue'

// 用户状态管理（初始为空）
const username = ref('')
const isLoggedIn = ref(false)
const isInitialized = ref(false)

// 用户相关的方法
function setUsername(name) {
  // 只在当前会话中设置用户名，不保存到localStorage
  username.value = name
  isLoggedIn.value = true
}

function clearUser() {
  username.value = ''
  isLoggedIn.value = false
}

// 初始化时主动清除可能存在的历史数据
function initUser() {
  // 清除localStorage中的用户数据（如果存在）
  try {
    localStorage.removeItem('username')
    localStorage.removeItem('userInfo')
  } catch (error) {
    // 忽略localStorage操作可能的错误
  }
  // 重置状态
  username.value = ''
  isLoggedIn.value = false
}

// 暴露的store
const userStore = {
  username,
  isLoggedIn,
  isInitialized,
  setUsername,
  clearUser,
  initUser
}

// 导出useUserStore组合式函数
export function useUserStore() {
  return userStore
}

// 同时支持默认导出
export default userStore