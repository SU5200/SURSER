<template>
  <div class="topics-view">
    <div class="header">
      <h1 class="page-title">选择一卷胶卷，走进一个小世界</h1>
    </div>

    <div class="counter-wrapper">
      <div class="counter-bg">
        <div class="shelf shelf-row-1"></div>
        <div class="shelf shelf-row-2"></div>
        <div class="shelf shelf-row-3"></div>

        <div class="topics-grid">
          <div 
            v-for="topic in topicStore.getAllTopics()" 
            :key="topic.id"
            class="topic-card film-roll"
            :style="{ '--edge-color': topic.color }"
            @click="navigateToTopic(topic.id)"
          >
            <!-- 胶卷上下打孔 -->
            <div class="film-holes film-holes-top">
              <span v-for="n in 10" :key="'t-' + n" class="hole"></span>
            </div>
            <div class="film-holes film-holes-bottom">
              <span v-for="n in 10" :key="'b-' + n" class="hole"></span>
            </div>

            <!-- 胶片主体 -->
            <div class="film-inner">
              <!-- 胶卷顶部小标签 -->
              <div class="film-header">
                <span class="film-icon">{{ topic.icon }}</span>
                <span class="film-label">FILM {{ topic.id }}</span>
              </div>

              <!-- 胶片画幅和话题信息 -->
              <div class="film-body">
                <div class="film-frame">
                  <div class="film-frame-window">
                    <div class="film-frame-left">
                      <div class="film-name">{{ topic.name }}</div>
                      <div class="film-highlight"></div>
                    </div>
                    <div class="film-frame-right">
                      <div class="film-count">
                        {{ topicStore.getTopicMessages(topic.id).length }} 条留言
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 胶卷投影 -->
            <div class="film-shadow"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useTopicStore } from '../store/topics.js'

const router = useRouter()
const topicStore = useTopicStore()

const navigateToTopic = (topicId) => {
  router.push(`/topic/${topicId}`)
}
</script>

<style scoped>
.topics-view {
  padding: 30px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5eee5 0%, #f0e3d4 45%, #c8a47a 100%);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #7f8c8d;
  margin: 0;
}

.counter-wrapper {
  max-width: 980px;
  margin: 0 auto;
}

.counter-bg {
  position: relative;
  padding: 35px 30px 45px;
  border-radius: 18px;
  background: linear-gradient(180deg, #fdf7ee 0%, #f3e1c9 55%, #d0a877 100%);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.shelf {
  position: absolute;
  left: -40px;
  right: -40px;
  height: 10px;
  background: linear-gradient(180deg, #c38e5a 0%, #9b6b3e 100%);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.28);
}

.shelf-row-1 {
  top: 27%;
}

.shelf-row-2 {
  top: 57%;
}

.shelf-row-3 {
  bottom: 18px;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px 30px;
  justify-items: center;
  position: relative;
  z-index: 1;
}

.topic-card {
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
}

.film-roll {
  width: 260px;
  height: 130px;
  border-radius: 10px;
  background: #1f1f1f;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  padding: 8px 10px;
  position: relative;
  overflow: visible;
}

.topic-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.4);
}

.film-holes {
  position: absolute;
  left: 10px;
  right: 10px;
  height: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
}

.film-holes-top {
  top: 4px;
}

.film-holes-bottom {
  bottom: 4px;
}

.hole {
  width: 10px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(245, 235, 210, 0.9);
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.4);
}

.film-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(135deg, #3b3028, #27201b);
  padding: 8px 10px 10px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.6);
}

.film-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #f7f3e9;
  font-size: 0.78rem;
  margin-bottom: 6px;
  padding: 0 2px;
}

.film-icon {
  font-size: 1.2rem;
}

.film-label {
  letter-spacing: 0.08em;
  font-weight: 600;
}

.film-body {
  display: flex;
  align-items: stretch;
  color: #fefaf3;
}

.film-frame {
  flex: 1;
  background: #15110f;
  border-radius: 4px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.film-frame-window {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: #d4b896;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  position: relative;
  overflow: hidden;
}

.film-frame-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
}

.film-frame-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
}

.film-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2c2c2c;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
  margin-bottom: 6px;
}

.film-highlight {
  width: 70%;
  max-width: 100px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f7e4b0, #f3cf7a);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

.film-count {
  font-size: 0.85rem;
  color: #2c2c2c;
  opacity: 0.9;
  text-align: right;
  font-weight: 500;
}

.film-shadow {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: -8px;
  height: 14px;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%);
  pointer-events: none;
}

@media (max-width: 768px) {
  .topics-view {
    padding: 20px;
  }
  
  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .counter-bg {
    padding: 22px 16px 30px;
  }
  
  .topics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 10px;
  }
  
  .topic-card {
    transform-origin: center bottom;
  }

  .film-roll {
    width: 160px;
    height: 120px;
    padding: 6px 8px;
  }
  
  .film-header {
    font-size: 0.7rem;
  }

  .film-name {
    font-size: 0.95rem;
  }
}
</style>