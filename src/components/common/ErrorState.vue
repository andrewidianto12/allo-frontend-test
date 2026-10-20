<template>
  <v-alert
    class="mb-6"
    :title="title"
    type="error"
    variant="tonal"
  >
    <p class="mb-4">
      {{ message }}
    </p>
    <v-btn
      color="error"
      prepend-icon="mdi-refresh"
      variant="flat"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </v-alert>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    message: string
    title?: string
  }>(), {
    title: 'Something went wrong',
  })

  const emit = defineEmits<{
    retry: []
  }>()
</script>
