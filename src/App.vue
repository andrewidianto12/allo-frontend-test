<template>
  <v-app>
    <v-app-bar
      color="surface"
      elevation="1"
    >
      <template #prepend>
        <v-icon
          class="ms-4"
          icon="mdi-rocket-launch"
        />
      </template>
      <v-app-bar-title>
        <RouterLink
          class="text-decoration-none text-high-emphasis"
          to="/"
        >
          SpaceX Rockets
        </RouterLink>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>
