<template>
  <div class="dashboard">
    <Draggable
        :group="{ name: 'widget', pull: 'clone', put: false }"
        class="toolbar toolbar-left"
        :list="components"
        item-key="id"
        @choose="handlePullWidget"
        :clone="handleClone"
    >
      <template #item="{element}">
        <div class="border border-black cursor-move my-2">{{ element.name }}</div>
      </template>
    </Draggable>
    <div class="fixed top-400px left-0 bg-black min-w-30 min-h-1rem z-100">
      {{ mouse }}
    </div>
    <div class="design-viewer" @wheel="handleWheel">
      <div class="w-40px h-40px absolute top-0 left-0 bg-gray-900"/>
      <CanvasRuler :padding="40" :scale="scale" class="ruler-top" :type="Types.HORIZONTAL"/>
      <CanvasRuler :padding="40" :scale="scale" class="ruler-left" :type="Types.VERTICAL"/>
      <div class="viewer">
        <Draggable
            ref="viewer"
            :list="widgets" class="bg-blue-100 w-1920px h-1080px relative"
            :style="{transformOrigin:'0 0',transform:`scale(${scale})`}"
            :group="{ name: 'widget',}"
            item-key="id"
            @add="handlePutWidget"
            @start="handleStartMoveWidget"
            @end="handleEndMoveWidget"
        >
          <template #item="{ element }">
            <div class="list-group-item absolute cursor-move  border border-dashed border-black"
                 :style="{ left: `${element.moving? element.oldOffsetX : element.offsetX}px`, top: `${element.moving? element.oldOffsetY : element.offsetY}px`}">
              {{ element.name }}
            </div>
          </template>
        </Draggable>
      </div>
    </div>
    <div class="toolbar toolbar-right">toolbar</div>
  </div>
</template>

<script setup>
import CanvasRuler from '@/components/canvas-ruler/canvas-ruler.vue'
import Draggable from 'vuedraggable'
import { Types } from '@/components/canvas-ruler/canvas-ruler-const.js'
import { computed, reactive, ref, unref } from 'vue'
import { cloneDeep } from 'lodash'
import { useMouse } from '@vueuse/core/index'

const mouse = reactive(useMouse())
//组件拖动
const components = reactive([
  { name: '测试1', id: 1 },
  { name: '测试2', id: 2 },
  { name: '测试3', id: 3 },
  { name: '测试4', id: 4 },
  { name: '测试5', id: 5 },
])
const viewer = ref()
const originPoint = computed(() => {
  return {
    x: unref(viewer)?.$el?.getBoundingClientRect()?.x ?? 0,
    y: unref(viewer)?.$el?.getBoundingClientRect()?.y ?? 0,
  }
})
const widgets = reactive([])
const handlePullWidget = function (ev) {
  console.log('pull', ev)
  const { oldIndex, originalEvent: { offsetX, offsetY } } = ev
  components[oldIndex].offsetX = offsetX
  components[oldIndex].offsetY = offsetY
  components[oldIndex].moving = true
}
const handlePutWidget = function (ev) {
  console.log('put', ev)
  const { newIndex, originalEvent: { clientX, clientY } } = ev
  console.log(clientX, originPoint, widgets[newIndex].offsetX)
  widgets[newIndex].offsetX = clientX - unref(mouse).x - widgets[newIndex].offsetX
  widgets[newIndex].offsetY = clientY - unref(mouse).y - widgets[newIndex].offsetY
  widgets[newIndex].moving = false
  console.log(unref(viewer))
}
const handleClone = function (component) {
  return cloneDeep(component)
}

const handleStartMoveWidget = function (ev) {
  console.log('start', ev)
  const { oldIndex, originalEvent: { offsetX, offsetY } } = ev
  widgets[oldIndex].oldOffsetX = widgets[oldIndex].offsetX
  widgets[oldIndex].oldOffsetY = widgets[oldIndex].offsetY
  widgets[oldIndex].offsetX = offsetX
  widgets[oldIndex].offsetY = offsetY
  widgets[oldIndex].moving = true
}
const handleEndMoveWidget = function (ev) {
  console.log('end', ev)
  const { newIndex, originalEvent: { offsetX, offsetY } } = ev
  widgets[newIndex].offsetX = offsetX - widgets[newIndex].offsetX
  widgets[newIndex].offsetY = offsetY - widgets[newIndex].offsetY
  widgets[newIndex].moving = false
}
//滚轮缩放
const scale = ref(1.0)
const handleWheel = function (ev) {
  const { wheelDelta, detail, ctrlKey } = ev
  if (!ctrlKey) {
    return
  }
  const scaleNumber = unref(scale)
  if (scaleNumber > 2) {
    scale.value = 2
    return
  }
  if (scaleNumber < 0.5) {
    scale.value = 0.5
    return
  }
  if (wheelDelta > 0 || detail > 0) {
    scale.value = scaleNumber * 1.05
  } else {
    scale.value = scaleNumber / 1.05
  }
}
</script>

<style scoped>
.dashboard {
  @apply flex flex-nowrap items-stretch h-full w-full;
}

.design-viewer {
  @apply flex-grow relative overflow-hidden;
}

.ruler-top {
  @apply absolute top-0 left-20px right-0;
}

.ruler-left {
  @apply absolute top-20px left-0  bottom-0;
}

.toolbar {
  @apply min-w-12rem shadow overflow-auto
}

.viewer {
  @apply absolute top-20px left-20px right-0
  bottom-0 bg-gray-700 overflow-auto p-40px
}
</style>
