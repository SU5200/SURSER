<template>
  <div class="topic-detail-view">
    <div class="container">
      <div class="header">
        <button class="back-btn" @click="goBack">← 返回话题列表</button>
        <div
          class="topic-info"
          :style="{ '--accent-color': currentTopic.color }"
        >
          <div class="topic-icon">{{ currentTopic.icon }}</div>
          <h1 class="topic-title">{{ currentTopic.name }}</h1>
          <p class="message-count">{{ messages.length }} 条留言</p>
        </div>
      </div>

      <!-- 木夹子麻绳九宫格分区 -->
      <section class="photo-wall">
        <div class="rope"></div>
        <div class="photo-grid">
          <div
            v-for="(zone, index) in zones"
            :key="index"
            class="photo-card"
            :class="{ 'has-polaroid': zone.polaroids && zone.polaroids.length > 0 }"
            @click="showZonePolaroid(index)"
          >
            <div class="clip"></div>
            <div class="photo-image">
              <img 
                v-if="zone.uploadedImage" 
                :src="zone.uploadedImage" 
                alt="上传的照片"
                class="photo-uploaded-img"
              />
              <div v-else class="photo-placeholder">
                <span class="placeholder-text">待上传</span>
              </div>
            </div>
            <div class="photo-label">
              <span class="zone-index">#{{ index + 1 }}</span>
              <span class="zone-title">{{ zone.title }}</span>
            </div>
          </div>
        </div>
      </section>
      
      <div class="content">
        <!-- 拍立得互动区 -->
        <section class="polaroid-section">
          <div class="polaroid-header">
            <h2>拍立得互动区</h2>
            <p>点击「拍一张」，生成你的专属拍立得小卡片，可以贴表情贴纸、写下想说的话。</p>
          </div>
          <button class="polaroid-btn" @click="addPolaroid">📸 拍一张</button>
          <div v-if="polaroids.length === 0" class="polaroid-empty">
            还没有拍立得哦，点击上面的按钮拍一张吧～
          </div>
          <div class="polaroid-list">
            <div
              v-for="card in polaroids"
              :key="card.id"
              class="polaroid-card"
            >
              <div class="polaroid-photo">
                <div class="polaroid-photo-inner">
                  <img 
                    v-if="card.photoUrl" 
                    :src="card.photoUrl" 
                    alt="上传的照片"
                    class="polaroid-uploaded-image"
                  />
                  <div v-else class="polaroid-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      class="polaroid-file-input"
                      @change="handlePhotoUpload($event, card)"
                    />
                    <span class="polaroid-upload-text">
                      <span v-if="card.sticker" class="polaroid-sticker">
                        {{ card.sticker }}
                      </span>
                      <span v-else>📷 点击上传照片</span>
                    </span>
                  </div>
                  <span 
                    v-if="card.sticker && card.photoUrl" 
                    class="polaroid-sticker-overlay"
                  >
                    {{ card.sticker }}
                  </span>
                </div>
              </div>
              <textarea
                v-model="card.text"
                class="polaroid-text"
                rows="2"
                placeholder="在这里写下一句想说的话..."
              ></textarea>
              <div class="polaroid-tools">
                <div class="polaroid-tools-row">
                  <div class="sticker-picker">
                    <span class="sticker-label">贴纸：</span>
                    <button
                      v-for="emoji in stickers"
                      :key="emoji"
                      type="button"
                      class="sticker-btn"
                      @click="card.sticker = emoji"
                    >
                      {{ emoji }}
                    </button>
                  </div>
                  <button
                    type="button"
                    class="polaroid-remove"
                    @click="removePolaroid(card.id)"
                  >
                    删除
                  </button>
                </div>
                <div v-if="card.photoUrl" class="share-section">
                  <span class="share-label">分享到：</span>
                  <select 
                    v-model="card.selectedZone" 
                    class="zone-select"
                  >
                    <option value="">选择分区</option>
                    <option 
                      v-for="(zone, index) in zones" 
                      :key="index" 
                      :value="index"
                    >
                      {{ zone.title }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="share-btn"
                    :disabled="card.selectedZone === '' || card.selectedZone === null"
                    @click="shareToZone(card, card.selectedZone)"
                  >
                    分享
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 留言表单 -->
        <div class="message-form-container notebook-form">
          <MessageForm 
            :topic-id="topicId" 
            @message-added="handleMessageAdded"
          />
        </div>

        <!-- 笔记本风格留言区 -->
        <div class="messages-container notebook-messages">
          <MessageList 
            :messages="messages" 
            @message-deleted="handleMessageDeleted"
          />
        </div>
      </div>
    </div>

    <!-- 拍立得展示弹窗 -->
    <div 
      v-if="showPolaroidModal" 
      class="polaroid-modal-overlay"
      @click="closePolaroidModal"
    >
      <div 
        class="polaroid-modal-content"
        @click.stop
      >
        <button class="modal-close-btn" @click="closePolaroidModal">×</button>
        <div class="modal-header">
          <h3>{{ selectedZoneTitle }}</h3>
          <p class="modal-count" v-if="selectedZonePolaroids.length > 0">
            共 {{ selectedZonePolaroids.length }} 张拍立得
          </p>
        </div>
        <div v-if="selectedZonePolaroids.length === 0" class="modal-empty">
          该分区还没有拍立得
        </div>
        <div class="modal-polaroids-list">
          <div
            v-for="(polaroid, index) in selectedZonePolaroids"
            :key="index"
            class="modal-polaroid-card"
          >
            <div class="modal-polaroid-photo">
              <img 
                v-if="polaroid.photoUrl" 
                :src="polaroid.photoUrl" 
                alt="拍立得照片"
                class="modal-photo-img"
              />
              <span 
                v-if="polaroid.sticker" 
                class="modal-sticker-overlay"
              >
                {{ polaroid.sticker }}
              </span>
            </div>
            <div 
              v-if="polaroid.text" 
              class="modal-polaroid-text"
            >
              {{ polaroid.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../store/user.js'
import { useTopicStore } from '../store/topics.js'
import MessageForm from '../components/MessageForm.vue'
import MessageList from '../components/MessageList.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const topicStore = useTopicStore()

const topicId = ref('')
const currentTopic = ref({
  id: '',
  name: '加载中...',
  icon: '⏳',
  color: '#95a5a6'
})

// 四个分区（可根据实际需求修改标题和图片）
const zones = ref([
  { title: '日常碎片', image: null, uploadedImage: null, polaroids: [] },
  { title: '小小心愿', image: null, uploadedImage: null, polaroids: [] },
  { title: '课堂记忆', image: null, uploadedImage: null, polaroids: [] },
  { title: '治愈瞬间', image: null, uploadedImage: null, polaroids: [] }
])

// 展示拍立得的弹窗
const showPolaroidModal = ref(false)
const selectedZonePolaroids = ref([])
const selectedZoneTitle = ref('')

// 拍立得卡片
let polaroidId = 0
const polaroids = ref([])
const stickers = ref(['😀', '🥰', '⭐', '🌸', '🎈', '🌙'])

// 计算属性获取当前话题的留言
const messages = computed(() => {
  return topicStore.getTopicMessages(topicId.value)
})

const loadTopicData = () => {
  const id = route.params.id
  if (!id) {
    router.push('/topics')
    return
  }
  
  topicId.value = id
  const topic = topicStore.getTopicById(id)
  
  if (topic) {
    currentTopic.value = topic
  } else {
    // 如果话题不存在，返回话题列表
    router.push('/topics')
  }
}

const handleMessageAdded = () => {
  // 留言添加后会自动通过计算属性更新
  console.log('留言已添加')
}

const addPolaroid = () => {
  polaroidId += 1
  polaroids.value.unshift({
    id: polaroidId,
    text: '',
    sticker: '',
    photo: null,
    photoUrl: null,
    selectedZone: ''
  })
}

const removePolaroid = (id) => {
  polaroids.value = polaroids.value.filter((card) => card.id !== id)
}

// 处理照片上传
const handlePhotoUpload = (event, card) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      card.photo = file
      card.photoUrl = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 分享照片到悬挂区域
const shareToZone = (card, zoneIndex) => {
  if (card.photoUrl && zoneIndex !== null && zoneIndex !== undefined && zoneIndex !== '') {
    const index = parseInt(zoneIndex)
    if (!isNaN(index) && index >= 0 && index < zones.value.length) {
      // 保存完整的拍立得数据到数组
      const polaroidData = {
        photoUrl: card.photoUrl,
        text: card.text,
        sticker: card.sticker,
        timestamp: new Date().toISOString()
      }
      zones.value[index].polaroids.push(polaroidData)
      // 更新显示的照片（显示最新的一张）
      zones.value[index].uploadedImage = card.photoUrl
      // 显示成功提示
      alert(`照片已分享到「${zones.value[index].title}」`)
      // 重置选择
      card.selectedZone = ''
    }
  }
}

// 点击分区展示拍立得
const showZonePolaroid = (zoneIndex) => {
  const zone = zones.value[zoneIndex]
  if (zone.polaroids && zone.polaroids.length > 0) {
    selectedZonePolaroids.value = zone.polaroids
    selectedZoneTitle.value = zone.title
    showPolaroidModal.value = true
  }
}

// 关闭拍立得弹窗
const closePolaroidModal = () => {
  showPolaroidModal.value = false
  selectedZonePolaroids.value = []
  selectedZoneTitle.value = ''
}

const handleMessageDeleted = (messageId) => {
  topicStore.deleteMessage(topicId.value, messageId)
}

const goBack = () => {
  router.push('/topics')
}

onMounted(() => {
  loadTopicData()
})

// 监听路由参数变化
route.params.id && watch(() => route.params.id, (newId) => {
  if (newId) {
    loadTopicData()
  }
})
</script>

<style scoped>
.topic-detail-view {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  margin-bottom: 30px;
}

.back-btn {
  background-color: transparent;
  border: none;
  color: #34495e;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.back-btn:hover {
  background-color: #e9ecef;
}

.topic-info {
  padding: 25px;
  border-radius: 12px;
  color: #3b2b23;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f2e3cf, #e0c7a4);
  border: 2px solid rgba(0, 0, 0, 0.06);
  position: relative;
}

.topic-info::after {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 10px;
  border: 1px dashed var(--accent-color, rgba(0, 0, 0, 0.15));
  opacity: 0.9;
}

.topic-icon {
  font-size: 3.5rem;
  margin-bottom: 15px;
}

.topic-title {
  font-size: 2.2rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.message-count {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

/* 木夹子麻绳九宫格分区 */
.photo-wall {
  margin: 30px 0 10px;
  position: relative;
}

.rope {
  height: 4px;
  background: linear-gradient(90deg, #c49a6c, #f1d3a5);
  border-radius: 999px;
  position: absolute;
  top: 0;
  left: -20px;
  right: -20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.photo-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.photo-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px 10px 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
  position: relative;
  transform-origin: top center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.photo-card:nth-child(odd) {
  transform: rotate(-2deg);
}

.photo-card:nth-child(even) {
  transform: rotate(2deg);
}

.photo-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
}

.photo-card.has-polaroid {
  cursor: pointer;
}

.photo-card.has-polaroid:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.clip {
  width: 18px;
  height: 22px;
  background: linear-gradient(180deg, #fefefe, #ddd);
  border-radius: 4px 4px 10px 10px;
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.clip::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 4px;
  right: 4px;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.1);
}

.photo-image {
  width: 100%;
  padding-bottom: 70%;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  margin-bottom: 6px;
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
}

.photo-uploaded-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  color: #999;
  font-size: 0.9rem;
}

.placeholder-text {
  opacity: 0.7;
}

.photo-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #555;
}

.zone-index {
  font-weight: 600;
  color: #d35400;
}

.zone-title {
  font-weight: 500;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 拍立得互动区 */
.polaroid-section {
  background: #fffdf7;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3e6c8;
}

.polaroid-header h2 {
  margin: 0 0 6px;
  font-size: 1.4rem;
  color: #333;
}

.polaroid-header p {
  margin: 0 0 16px;
  font-size: 0.95rem;
  color: #777;
}

.polaroid-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #ffafbd, #ffc3a0);
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(255, 175, 189, 0.45);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 10px;
}

.polaroid-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 16px rgba(255, 175, 189, 0.6);
}

.polaroid-empty {
  font-size: 0.9rem;
  color: #999;
  margin-top: 4px;
}

.polaroid-list {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.polaroid-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px 10px 12px;
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.15);
  position: relative;
}

.polaroid-photo {
  background: #f3f3f3;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 8px;
}

.polaroid-photo-inner {
  border-radius: 6px;
  background: radial-gradient(circle at top, #ffece3, #f7d3ff);
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6px;
  position: relative;
  overflow: hidden;
}

.polaroid-uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.polaroid-upload-area {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.polaroid-file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.polaroid-upload-text {
  font-size: 0.8rem;
  color: #8e44ad;
  pointer-events: none;
}

.polaroid-sticker {
  font-size: 2rem;
}

.polaroid-sticker-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  pointer-events: none;
  z-index: 10;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));
}

.polaroid-text {
  width: 100%;
  margin-top: 4px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #f0d7c4;
  resize: none;
  font-size: 0.85rem;
  font-family: 'KaiTi', 'STKaiti', 'DFKai-SB', 'Comic Sans MS', cursive;
  background-color: #fffaf3;
}

.polaroid-text:focus {
  outline: none;
  border-color: #f39c12;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.15);
}

.polaroid-tools {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.polaroid-tools-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  flex-wrap: wrap;
}

.sticker-picker {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.sticker-label {
  font-size: 0.78rem;
  color: #666;
}

.sticker-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  padding: 2px;
}

.share-section {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.share-label {
  font-size: 0.78rem;
  color: #666;
}

.zone-select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #f0d7c4;
  font-size: 0.8rem;
  background-color: #fffaf3;
  color: #333;
  cursor: pointer;
}

.zone-select:focus {
  outline: none;
  border-color: #f39c12;
}

.share-btn {
  border: none;
  background-color: #4CAF50;
  color: #fff;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.share-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.share-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.polaroid-remove {
  border: none;
  background-color: #ff7675;
  color: #fff;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.75rem;
  cursor: pointer;
  align-self: flex-end;
}

.polaroid-remove:hover {
  background-color: #e74c3c;
}

.message-form-container {
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.messages-container {
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-height: 200px;
}

/* 笔记本风格增强 */
.notebook-form {
  position: relative;
  overflow: hidden;
}

.notebook-messages {
  position: relative;
  background-image: linear-gradient(#f9f3e9 0, #f9f3e9 24px, #e8d9bd 25px);
  background-size: 100% 25px;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.notebook-messages::before {
  content: '';
  position: absolute;
  top: 0;
  left: 36px;
  bottom: 0;
  width: 2px;
  background: linear-gradient(#f06292, #ec407a);
  opacity: 0.6;
}

.notebook-messages::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  box-shadow: inset 0 0 14px rgba(0, 0, 0, 0.08);
  pointer-events: none;
}

@media (max-width: 768px) {
  .topic-detail-view {
    padding: 15px;
  }
  
  .topic-icon {
    font-size: 2.5rem;
  }
  
  .topic-title {
    font-size: 1.8rem;
  }
  
  .content {
    gap: 20px;
  }
  
  .message-form-container,
  .messages-container {
    padding: 20px;
  }

  .photo-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .polaroid-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 拍立得展示弹窗 */
.polaroid-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.polaroid-modal-content {
  background: #fffdf7;
  border-radius: 16px;
  padding: 25px;
  max-width: 500px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.1);
  color: #333;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background-color: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.modal-header {
  margin-bottom: 20px;
  text-align: center;
}

.modal-header h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.5rem;
}

.modal-count {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.modal-empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 1rem;
}

.modal-polaroids-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-polaroid-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.modal-polaroid-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.modal-polaroid-photo {
  position: relative;
  width: 100%;
  padding-bottom: 75%;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f3f3;
  margin-bottom: 12px;
}

.modal-photo-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-sticker-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  pointer-events: none;
  z-index: 10;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));
}

.modal-polaroid-text {
  padding: 12px;
  background-color: #fffaf3;
  border-radius: 6px;
  color: #333;
  font-size: 1rem;
  line-height: 1.6;
  font-family: 'KaiTi', 'STKaiti', 'DFKai-SB', 'Comic Sans MS', cursive;
  border: 1px solid #f0d7c4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

@media (max-width: 768px) {
  .polaroid-modal-content {
    padding: 20px;
    max-width: 95%;
  }

  .modal-header h3 {
    font-size: 1.3rem;
  }

  .modal-sticker-overlay {
    font-size: 3rem;
  }
}
</style>