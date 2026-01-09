<!-- components/Footer.vue -->
<template>
  <footer class="sticky bottom-0 left-0 w-full flex border-t shadow-md">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.href"
      :to="tab.href"
      :class="[
        'flex-1 text-center py-3 font-semibold transition',
        isActive(tab) 
          ? 'bg-blue-600 text-white' 
          : 'bg-white text-gray-500 hover:bg-gray-100'
      ]"
    >
      {{ tab.label }}
    </NuxtLink>
  </footer>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { href: '/vote', label: 'Vote' },
  { href: '/polls', label: 'Polls' },
]

const isActive = (tab) => {
  return route.path === tab.href || (tab.href === '/vote' && route.path === '/')
}
</script>
