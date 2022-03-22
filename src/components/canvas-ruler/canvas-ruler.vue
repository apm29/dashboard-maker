<template>
  <canvas v-if="type === Types.HORIZONTAL" ref="canvas" width="9999" height="20"/>
  <canvas v-else-if="type === Types.VERTICAL" ref="canvas" width="20" height="9999"/>
</template>

<script setup>
import { Types } from '@/components/canvas-ruler/canvas-ruler-const'
import { onMounted, ref, toRefs, unref, watch } from 'vue'

const props = defineProps({
  type: {
    type: Number,
    default: Types.HORIZONTAL,
  },
  scale: {
    type: Number,
    default: 1,
  },
  padding: {
    type: Number,
    default: 0,
  },
})
const canvas = ref()
const drawHorizontal = function () {
  const canvasInstance = unref(canvas)
  const ctx = canvasInstance.getContext('2d')
  const padding = props.padding
  ctx.fillStyle = '#0F1C2E'
  ctx.strokeStyle = '#FFF'
  ctx.lineWidth = 0.5
  ctx.fillRect(0, 0, 9999, 20)
  ctx.beginPath()
  for (let i = 0; i < 9999; i++) {
    let oct = i % 10 === 0
    ctx.moveTo(padding + i * 10, 0)
    ctx.lineTo(padding +  i * 10, oct ? 10 : 5)
    if (oct) {
      ctx.fillStyle = '#FFF'
      let text = `${i * 10}`
      const { width } = ctx.measureText(text)
      ctx.fillText(text, padding +  i * 10 - width / 2, 19)
    }
  }
  ctx.stroke()
}
const drawVertical = function () {
  const canvasInstance = unref(canvas)
  const ctx = canvasInstance.getContext('2d')
  const padding = props.padding
  ctx.fillStyle = '#0F1C2E'
  ctx.strokeStyle = '#FFF'
  ctx.lineWidth = 0.5
  ctx.fillRect(0, 0, 20, 9999)
  ctx.beginPath()
  for (let i = 0; i < 9999; i++) {
    let oct = i % 10 === 0
    ctx.moveTo(0, padding + i * 10)
    ctx.lineTo(oct ? 10 : 5, padding + i * 10)
    if (oct) {
      ctx.fillStyle = '#FFF'
      ctx.save()
      let text = `${i * 10}`
      const { width } = ctx.measureText(text)
      ctx.translate(19, padding +  i * 10 + width / 2)
      ctx.rotate(-Math.PI / 180 * 90)
      ctx.fillText(text, 0, 0)
      ctx.restore()
    }
  }
  ctx.stroke()
}
const scaleRule = function (newValue, oldValue) {
  const canvasInstance = unref(canvas)
  const ctx = canvasInstance.getContext('2d')
  if (props.type === Types.HORIZONTAL) {
    ctx.scale(1 / oldValue, 1)
    ctx.scale(newValue, 1)
    drawHorizontal()
  } else {
    ctx.scale(1, 1 / oldValue)
    ctx.scale(1, newValue)
    drawVertical()
  }
}
const { scale } = toRefs(props)
watch(scale, scaleRule)
if (props.type === Types.HORIZONTAL) {
  onMounted(drawHorizontal)
} else if (props.type === Types.VERTICAL) {
  onMounted(drawVertical)
}


</script>

<style scoped>

</style>
