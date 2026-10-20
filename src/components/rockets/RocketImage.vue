<template>
  <v-img
    :alt="alt"
    class="bg-grey-darken-3"
    :cover="cover"
    :height="height"
    :src="displaySrc"
    @error="failed = true"
  />
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import placeholder from '@/assets/rocket-placeholder.svg'

  const props = withDefaults(defineProps<{
    src: string | null
    alt: string
    height?: number | string
    cover?: boolean
  }>(), {
    height: 200,
    cover: true,
  })

  // Falls back to the placeholder when the URL is missing or fails to load
  const failed = ref(false)
  watch(() => props.src, () => { failed.value = false })

  const displaySrc = computed(() => (!props.src || failed.value ? placeholder : props.src))
</script>
