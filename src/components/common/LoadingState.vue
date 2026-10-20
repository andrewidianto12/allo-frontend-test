<template>
  <div
    aria-busy="true"
    aria-live="polite"
    role="status"
  >
    <v-row v-if="variant === 'cards'">
      <v-col
        v-for="n in 8"
        :key="n"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>

    <v-skeleton-loader
      v-else-if="variant === 'detail'"
      type="image, article, list-item-two-line@3"
    />

    <div
      v-else
      class="d-flex flex-column align-center py-12"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="48"
      />
    </div>

    <p class="text-center text-medium-emphasis mt-4">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    message?: string
    variant?: 'spinner' | 'cards' | 'detail'
  }>(), {
    message: 'Loading...',
    variant: 'spinner',
  })
</script>
