<template>
  <div class="range-slider">
    <label v-if="label" :for="id" class="mb-4 text-base font-medium text-word-font-fill">
      {{ label }}
    </label>
    <div class="slider-value relative w-[100%] -left-[5%] mt-4">
      <span class="absolute w-auto font-semibold top-[-35px] -left-[50px] z-[2] leading-[55px] select-none whitespace-nowrap" :class="colorClass"
        :style="{ left: thumbPosition }">
        {{ displayValue }}
      </span>
    </div>
    <input :id="id" type="range" :value="modelValue" :min="min" :max="max" :step="step"
      @input="$emit('update:modelValue', parseInt(($event.target as HTMLInputElement).value))"
      class="w-full mt-5 h-[5px] bg-gray-300 rounded-md outline-none border-none appearance-none slider"
      :class="sliderColorClass" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  label?: string
  modelValue: number
  min: number
  max: number
  step: number
  unit?: string
  color?: 'blue' | 'green'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  unit: ''
})

defineEmits<{
  'update:modelValue': [value: number]
}>()

const displayValue = computed(() => {
  return props.unit ? `${props.modelValue} ${props.unit}` : props.modelValue.toString()
})

const thumbPosition = computed(() => {
  const p = (props.modelValue - props.min) / 
            (props.max - props.min);
  const thumbWidth = 24; // matches CSS width
  // Formula: percent + correction for thumb width
  return `calc(${p * 100}% + (${thumbWidth/2 - p * thumbWidth}px))`;
})

const colorClass = computed(() => {
  return props.color === 'blue' ? 'text-player-blue' : 'text-player-green'
})

const sliderColorClass = computed(() => {
  return props.color === 'blue' ? 'slider-blue' : 'slider-green'
})
</script>

<style scoped>
/* Custom range slider styles */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 23px;
  height: 23px;
  border-radius: 20px;
  border: 5px solid white;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 20px;
  border: 5px solid white;
  cursor: pointer;
}

.slider-blue::-webkit-slider-thumb {
  background: theme('colors.player.blue');
}

.slider-blue::-moz-range-thumb {
  background: theme('colors.player.blue');
}

.slider-green::-webkit-slider-thumb {
  background: theme('colors.player.green');
}

.slider-green::-moz-range-thumb {
  background: theme('colors.player.green');
}
</style>
