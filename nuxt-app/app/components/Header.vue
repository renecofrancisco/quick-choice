<!-- components/Header.vue -->
<template>
  <header class="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 left-0 w-full z-10">
    <h1 class="text-xl font-bold">
      Quick Choice (Nuxt via {{ backendName }})
    </h1>

    <div class="relative flex items-center space-x-4" ref="containerRef" v-click-outside="closeProfileMenu">
      <span class="font-semibold">{{ credits ?? 0 }} 💎</span>

      <div class="relative">
        <button
          @click="showProfileMenu = !showProfileMenu"
          class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
        >
          <span class="text-gray-700 font-bold">👤</span>
        </button>

        <div
          v-if="showProfileMenu"
          class="absolute right-0 top-full mt-2 w-32 bg-white border shadow-md rounded z-20"
        >
          <button
            @click="handleLogout"
            class="w-full text-left p-2 hover:bg-gray-100 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Refs for state
const credits = ref<number | null>(null)
const showProfileMenu = ref(false)
const containerRef = ref<HTMLElement | null>(null)

// Simulated services (replace with real API calls)
const authService = {
  getUser: async () => ({ id: 1, name: 'Rene' }),
  signOut: async () => {}
}
const profileService = {
  getUserProfile: async (userId: number) => ({ credits: 42 })
}

// Fetch credits
const fetchCredits = async () => {
  const user = await authService.getUser()
  if (!user) return

  try {
    const profile = await profileService.getUserProfile(user.id)
    credits.value = profile?.credits ?? 0
  } catch (err) {
    console.error('Error fetching credits:', err)
    credits.value = 0
  }
}

// Logout handler
const handleLogout = async () => {
  await authService.signOut()
  // broadcastAuthStateChangeEvent() equivalent can be handled via Pinia store
  window.location.href = '/'
}

// Close dropdown when clicking outside
const closeProfileMenu = () => {
  showProfileMenu.value = false
}

onMounted(fetchCredits)

// Backend type (replace with environment variable or constant)
const backendTypeEnv = Number(import.meta.env.NUXT_PUBLIC_BACKEND_TYPE)
const backendType = backendTypeEnv ?? 0
const BackendType = ['GraphQL', 'REST', 'ASP.NET'] // example
const backendName = BackendType[backendType] ?? 'Unknown'
</script>

<script lang="ts">
// Import Directive as a type-only import
import type { Directive } from 'vue'

export const clickOutside: Directive = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('mousedown', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
/* Optional custom styles */
</style>
