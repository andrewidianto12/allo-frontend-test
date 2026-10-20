<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <RocketImage
          :alt="rocket.name"
          height="360"
          :src="rocket.imageUrl"
        />
      </v-card>
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <div class="d-flex align-center flex-wrap ga-2 mb-4">
        <h1 class="text-h4">
          {{ rocket.name }}
        </h1>
        <v-chip
          v-if="rocket.isLocal"
          color="secondary"
          size="small"
        >
          Local rocket
        </v-chip>
      </div>

      <p class="text-body-1 mb-6">
        {{ rocket.description ?? 'No description available.' }}
      </p>

      <v-list
        bg-color="transparent"
        lines="two"
      >
        <v-list-item
          v-for="item in details"
          :key="item.label"
          :prepend-icon="item.icon"
          :subtitle="item.label"
          :title="item.value"
        />
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import type { Rocket } from '@/types/rocket'
  import { formatCurrency, formatDate } from '@/utils/format'

  const props = defineProps<{
    rocket: Rocket
  }>()

  const details = computed(() => [
    { label: 'Cost per launch', value: formatCurrency(props.rocket.costPerLaunch), icon: 'mdi-currency-usd' },
    { label: 'Country', value: props.rocket.country ?? 'Unknown', icon: 'mdi-flag' },
    { label: 'First flight', value: formatDate(props.rocket.firstFlight), icon: 'mdi-calendar' },
  ])
</script>
