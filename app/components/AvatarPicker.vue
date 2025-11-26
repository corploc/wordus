<template>
  <div class="avatar-picker flex flex-col items-center">
    <img :src="`/images/avatars/${avatar}`" :class="`color-${color}`" class="h-32 w-32 rounded-full bg-white border-4"
      :style="{ borderColor: borderColor }" alt="Avatar" />

    <button type="button" @click="$emit('random')"
      class="btn mt-6 flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors"
      :class="`color-${color}`" :style="{ backgroundColor: borderColor }">
      <svg viewBox="0 0 38 51" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" style="fill:white;">
        <g transform="matrix(1,0,0,1,-3160.2,-486.799)">
          <g transform="matrix(1,0,0,1,1510.69,-15.4586)">
            <g transform="matrix(0.7086,0.189869,-0.189869,0.7086,599.924,-159.105)">
              <path
                d="M1656.49,561.375L1642.02,548.798L1656.49,536.222L1656.49,545.227C1663.61,542.358 1668.64,535.379 1668.64,527.234C1668.64,520.118 1664.8,513.893 1659.08,510.52L1660.63,504.015C1669.2,508.226 1675.11,517.046 1675.11,527.234C1675.11,538.992 1667.24,548.927 1656.49,552.06L1656.49,561.375ZM1642.02,502.408L1642.02,493.36L1656.49,505.936L1642.02,518.513L1642.02,509.241C1634.89,512.11 1629.86,519.089 1629.86,527.234C1629.86,532.913 1632.31,538.026 1636.2,541.574C1637.2,542.485 1638.3,543.293 1639.48,543.981L1637.93,550.481C1629.33,546.281 1623.4,537.445 1623.4,527.234C1623.4,515.476 1631.26,505.541 1642.02,502.408Z"
                style="fill:white;" />
            </g>
          </g>
        </g>
      </svg>
      <p class="text-white">{{ $t('user.randomImage') }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  avatar: string
  color: string
}

const props = defineProps<Props>()
defineEmits<{
  random: []
}>()

const borderColor = computed(() => {
  const colorMap: Record<string, string> = {
    yellow: '#FFCC5E',
    blue: '#5E94FF',
    green: '#2CDA75',
    brown: '#BE7B67',
    purple: '#B85EFF',
    pink: '#FF5EBA'
  }
  return colorMap[props.color] || '#FFCC5E'
})
</script>
