import { ref, reactive } from 'vue'

// 初始化话题列表
const topics = ref([
  { id: '1', name: '做游戏', color: '#E74C3C', icon: '🎮' },
  { id: '2', name: '咨询家', color: '#3498DB', icon: '💡' },
  { id: '3', name: '停一停', color: '#2ECC71', icon: '⏸️' },
  { id: '4', name: '英雄榜', color: '#F39C12', icon: '🏆' },
  { id: '5', name: '休息吧', color: '#9B59B6', icon: '😴' },
  { id: '6', name: '开小差', color: '#1ABC9C', icon: '💭' },
  { id: '7', name: '当老师', color: '#D35400', icon: '👨‍🏫' },
  { id: '8', name: '新空间', color: '#34495E', icon: '🌌' },
  { id: '9', name: '小剧场', color: '#E67E22', icon: '🎭' }
])

// 话题留言数据（模拟）
const topicMessages = reactive({
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [],
  '6': [],
  '7': [],
  '8': [],
  '9': []
})

// 获取所有话题
function getAllTopics() {
  return topics.value
}

// 根据ID获取话题
function getTopicById(id) {
  return topics.value.find(topic => topic.id === id)
}

// 获取话题的留言
function getTopicMessages(topicId) {
  return topicMessages[topicId] || []
}

// 添加新留言到话题
function addMessage(topicId, message) {
  if (!topicMessages[topicId]) {
    topicMessages[topicId] = []
  }
  topicMessages[topicId].unshift({
    ...message,
    timestamp: new Date().toISOString()
  })
}

// 删除话题留言
function deleteMessage(topicId, messageId) {
  if (topicMessages[topicId]) {
    topicMessages[topicId] = topicMessages[topicId].filter(msg => msg.id !== messageId)
  }
}

// 添加新话题
function addTopic(topic) {
  const newTopic = {
    id: Date.now().toString(),
    ...topic
  }
  topics.value.push(newTopic)
  // 初始化新话题的留言数组
  topicMessages[newTopic.id] = []
  return newTopic
}

// 话题相关的store
export function useTopicStore() {
  return {
    topics,
    topicMessages,
    getAllTopics,
    getTopicById,
    getTopicMessages,
    addMessage,
    deleteMessage,
    addTopic
  }
}